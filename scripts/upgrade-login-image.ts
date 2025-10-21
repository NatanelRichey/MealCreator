// CRITICAL: Load environment variables BEFORE any other imports
import { config } from 'dotenv';
config({ path: '.env.local' });

import https from 'https';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Unsplash photo details
const UNSPLASH_PHOTO_ID = 'photo-1543353071-873f17a7a088';
const UNSPLASH_HIGH_RES_URL = `https://images.unsplash.com/${UNSPLASH_PHOTO_ID}?q=100&w=2000&fit=max`;

// Configure Cloudinary (using correct env variable names)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Download image from URL
 */
async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        fs.unlink(filepath, () => {});
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Upload image to Cloudinary
 */
async function uploadToCloudinary(filepath: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder: 'meal-creator',
      public_id: 'login-background',
      overwrite: true,
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error}`);
  }
}

async function upgradeLoginImage() {
  const tempFilePath = path.join(process.cwd(), 'temp-login-image.jpg');

  try {
    console.log('🖼️  Upgrading Login Background Image\n');
    console.log('════════════════════════════════════════\n');

    // Step 1: Download high-res image from Unsplash
    console.log('📥 Downloading high-resolution image from Unsplash...');
    console.log(`   Photo ID: ${UNSPLASH_PHOTO_ID}`);
    console.log(`   Quality: 100%, Width: 2000px\n`);
    
    await downloadImage(UNSPLASH_HIGH_RES_URL, tempFilePath);
    
    // Check file size
    const stats = fs.statSync(tempFilePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    console.log(`✅ Downloaded successfully (${fileSizeInMB.toFixed(2)} MB)\n`);

    // Step 2: Upload to Cloudinary
    console.log('☁️  Uploading to Cloudinary...');
    const cloudinaryUrl = await uploadToCloudinary(tempFilePath);
    console.log(`✅ Uploaded successfully!\n`);

    // Step 3: Clean up temp file
    fs.unlinkSync(tempFilePath);
    console.log('🧹 Cleaned up temporary file\n');

    // Step 4: Display results
    console.log('═══════════════════════════════════════════════\n');
    console.log('✨ SUCCESS! Image upgraded successfully!\n');
    console.log('📋 New Cloudinary URL:');
    console.log(`   ${cloudinaryUrl}\n`);
    console.log('📝 Next Steps:');
    console.log('   1. Update LoginForm.tsx with new Cloudinary URL');
    console.log('   2. Replace the Unsplash URL with Cloudinary URL');
    console.log('   3. Test the login page\n');
    console.log('Old URL (Unsplash - low res):');
    console.log(`   https://images.unsplash.com/${UNSPLASH_PHOTO_ID}?...&w=870&q=80\n`);
    console.log('New URL (Cloudinary - high res):');
    console.log(`   ${cloudinaryUrl}\n`);

  } catch (error) {
    console.error('\n❌ Error upgrading image:', error);
    
    // Clean up temp file if it exists
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    
    process.exit(1);
  }
}

upgradeLoginImage();

