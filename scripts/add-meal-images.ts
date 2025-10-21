/**
 * FIND AND ADD IMAGES FOR MEALS WITHOUT CUSTOM IMAGES
 * 
 * Uses Pexels API (free, 200 requests/hour) to:
 * 1. Search for food photos matching meal name
 * 2. Download the best matching image
 * 3. Upload to YOUR Cloudinary
 * 4. Update meals that have the default image only
 */

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

// Pexels API configuration (free tier: 200 requests/hour - much better!)
// Get your free API key at: https://www.pexels.com/api/
const PEXELS_API_KEY = 'HUi0Ha3HeG7U4jKaWQJHIIllkEse6CQUpAe2qW8eeA5ZyqnZHdRdx1gf';
const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg';

const TEST_MODE = false;  // ✅ Processing all remaining meals!
const TEST_LIMIT = 10;    // Not used when TEST_MODE = false

/**
 * Search Pexels for food image with fallback strategies
 */
async function searchPexelsImage(mealName: string): Promise<string | null> {
  return new Promise((resolve) => {
    // Clean meal name - extract main ingredient/dish type
    let searchQuery = mealName
      .replace(/\([^)]*\)/g, '') // Remove parentheses
      .replace(/[^a-zA-Z0-9\s]/g, ' ') // Remove special chars
      .trim();
    
    // Try to get the main dish name (first 1-2 meaningful words)
    const words = searchQuery.split(' ').filter(w => w.length > 2);
    searchQuery = words.slice(0, 2).join(' ');
    
    // Make search more generic for better results
    const finalQuery = searchQuery || 'food';
    
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(finalQuery)}&per_page=1`;
    
    const options = {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    };
    
    const req = https.get(url, options, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          // Debug: show response
          if (result.error) {
            console.log(`  ❌ API Error: ${result.error}`);
            resolve(null);
            return;
          }
          
          if (result.photos && result.photos.length > 0) {
            const imageUrl = result.photos[0].src.large;
            console.log(`  ✅ Found image for: "${finalQuery}"`);
            resolve(imageUrl);
          } else {
            console.log(`  ⚠️  No results for: "${finalQuery}"`);
            resolve(null);
          }
        } catch (error: any) {
          console.log(`  ❌ Parse error: ${error.message}`);
          console.log(`  Response: ${data.substring(0, 200)}`);
          resolve(null);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`  ❌ Request failed: ${error.message}`);
      resolve(null);
    });
    
    req.end();
  });
}

/**
 * Download image and upload to Cloudinary
 */
async function uploadToCloudinary(imageUrl: string, mealName: string): Promise<string> {
  return new Promise((resolve) => {
    https.get(imageUrl, (response) => {
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
              folder: 'meal-images',
              public_id: safeFileName,
              overwrite: true,
              transformation: [
                { width: 800, height: 800, crop: 'fill' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
              ]
            }
          );

          console.log(`  ✅ Uploaded to Cloudinary`);
          resolve(uploadResult.secure_url);
        } catch (error) {
          console.error(`  ❌ Upload failed`);
          resolve(DEFAULT_IMAGE_URL);
        }
      });
    }).on('error', () => resolve(DEFAULT_IMAGE_URL));
  });
}

async function addMealImages() {
  await connectDB();
  
  console.log('🔍 Finding meals with default images ONLY...\n');
  
  // Find ONLY meals using the default image (not custom CookBook images)
  const mealsWithoutImages = await Meal.find({
    owner: 'default',
    imgSrc: DEFAULT_IMAGE_URL
  });
  
  console.log(`📊 Found ${mealsWithoutImages.length} meals without custom images\n`);
  
  if (mealsWithoutImages.length === 0) {
    console.log('✅ All meals already have custom images!');
    process.exit(0);
  }
  
  const mealsToProcess = TEST_MODE 
    ? mealsWithoutImages.slice(0, TEST_LIMIT) 
    : mealsWithoutImages;
  
  console.log(`📋 Processing ${mealsToProcess.length} meals${TEST_MODE ? ' (TEST MODE)' : ''}...\n`);
  console.log('⚠️  Make sure you added your Pexels API key to the script!\n');
  
  let updated = 0;
  let skipped = 0;
  
  for (const meal of mealsToProcess) {
    console.log(`\n📝 ${meal.mealName}`);
    
    // Search for image on Pexels
    const imageUrl = await searchPexelsImage(meal.mealName);
    
    if (!imageUrl) {
      console.log(`  ⏭️  Skipping (no image found)`);
      skipped++;
      continue;
    }
    
    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(imageUrl, meal.mealName);
    
    if (cloudinaryUrl !== DEFAULT_IMAGE_URL) {
      meal.imgSrc = cloudinaryUrl;
      await meal.save();
      console.log(`  💾 Saved to database`);
      updated++;
    } else {
      skipped++;
    }
    
    // Delay to respect API rate limits (200/hour = 1 every 18 seconds, we'll do 1 per second)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n
╔════════════════════════════════════════╗
║       IMAGE SEARCH RESULTS             ║
╠════════════════════════════════════════╣
║ ✅ Updated:  ${updated.toString().padEnd(27)} ║
║ ⏭️  Skipped:  ${skipped.toString().padEnd(27)} ║
║ 📝 Total:    ${mealsToProcess.length.toString().padEnd(27)} ║
╚════════════════════════════════════════╝
  `);
  
  console.log('\n📊 API Info: Pexels allows 200 requests/hour (free tier)');
  console.log(`Remaining meals: ${mealsWithoutImages.length - mealsToProcess.length}\n`);
  
  process.exit(0);
}

addMealImages();

