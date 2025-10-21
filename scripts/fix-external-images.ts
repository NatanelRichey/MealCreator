// Find and fix meals with external CookBook images
import { config } from 'dotenv';
config({ path: '.env.local' });

import connectDB from '../lib/db';
import Meal from '../lib/models/Meal';
import { v2 as cloudinarySDK } from 'cloudinary';
import https from 'https';

// Configure Cloudinary
cloudinarySDK.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function migrateImage(imageUrl: string, mealName: string): Promise<string> {
  return new Promise((resolve) => {
    https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        console.log(`  ⚠️  Failed to download, using default`);
        resolve('https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg');
        return;
      }

      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const safeFileName = mealName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);

          const uploadResult = await cloudinarySDK.uploader.upload(
            `data:image/jpeg;base64,${buffer.toString('base64')}`,
            {
              folder: 'cookbook-imports',
              public_id: safeFileName,
              overwrite: true,
              transformation: [
                { width: 800, height: 800, crop: 'fill' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
              ]
            }
          );

          console.log(`  ✅ Migrated to Cloudinary`);
          resolve(uploadResult.secure_url);
        } catch (error) {
          console.error(`  ❌ Upload failed:`, error);
          resolve('https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg');
        }
      });
    }).on('error', () => {
      resolve('https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg');
    });
  });
}

async function fixExternalImages() {
  await connectDB();
  
  console.log('🔍 Finding meals with external images...\n');
  
  // Find meals with cookbookmanager.com images
  const mealsWithExternalImages = await Meal.find({
    owner: 'default',
    imgSrc: { $regex: 'cookbookmanager.com' }
  });
  
  console.log(`📊 Found ${mealsWithExternalImages.length} meals with external images\n`);
  
  if (mealsWithExternalImages.length === 0) {
    console.log('✅ All images already on Cloudinary!');
    process.exit(0);
  }
  
  let fixed = 0;
  
  for (const meal of mealsWithExternalImages) {
    console.log(`\n📝 ${meal.mealName}`);
    console.log(`  📸 Migrating: ${meal.imgSrc.substring(0, 80)}...`);
    
    const newImageUrl = await migrateImage(meal.imgSrc, meal.mealName);
    meal.imgSrc = newImageUrl;
    await meal.save();
    
    fixed++;
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n✅ Fixed ${fixed} meals with external images!`);
  process.exit(0);
}

fixExternalImages();


