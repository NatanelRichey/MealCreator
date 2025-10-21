import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Meal from '@/lib/models/Meal';
import cloudinary from '@/lib/cloudinary';

/**
 * POST /api/migrate-images
 * 
 * Migrate all Unsplash images to Cloudinary
 * 
 * HOW IT WORKS:
 * 1. Find all meals with Unsplash image URLs
 * 2. For each meal:
 *    - Download image from Unsplash
 *    - Upload to Cloudinary
 *    - Update meal with new Cloudinary URL
 * 
 * WHY THIS IS GOOD:
 * - All images on one CDN (Cloudinary) = faster, more reliable
 * - Can use CldImage everywhere (better optimization)
 * - No dependency on Unsplash staying online
 * - Better control over image quality/size
 */
export async function POST() {
  try {
    await connectDB();

    // Find all meals with Unsplash images
    const mealsWithUnsplash = await Meal.find({
      imgSrc: { $regex: /unsplash\.com/ }
    });

    console.log(`📸 Found ${mealsWithUnsplash.length} meals with Unsplash images`);

    const results = {
      total: mealsWithUnsplash.length,
      migrated: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Migrate each meal's image
    for (const meal of mealsWithUnsplash) {
      try {
        console.log(`  → Migrating image for: ${meal.mealName}`);
        
        // Upload Unsplash URL to Cloudinary
        // Cloudinary can fetch and upload from a URL directly!
        const uploadResult = await cloudinary.uploader.upload(meal.imgSrc, {
          folder: 'meal-images',
          public_id: `${meal._id}`, // Use meal ID as filename
          overwrite: false,
          transformation: [
            { width: 800, height: 800, crop: 'fill', quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });

        // Update meal with new Cloudinary URL
        meal.imgSrc = uploadResult.secure_url;
        await meal.save();

        console.log(`  ✅ Migrated: ${meal.mealName} → ${uploadResult.secure_url}`);
        results.migrated++;

      } catch (error: any) {
        console.error(`  ❌ Failed to migrate: ${meal.mealName}`, error.message);
        results.failed++;
        results.errors.push(`${meal.mealName}: ${error.message}`);
      }
    }

    console.log(`\n✅ Migration complete! ${results.migrated} migrated, ${results.failed} failed`);

    return NextResponse.json(
      {
        message: 'Image migration complete',
        results
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Migration error:', error);

    return NextResponse.json(
      { error: 'Migration failed', details: error.message },
      { status: 500 }
    );
  }
}

