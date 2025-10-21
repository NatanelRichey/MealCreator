// CRITICAL: Load environment variables BEFORE any other imports
import { config } from 'dotenv';
config({ path: '.env.local' });

import mongoose from 'mongoose';

const DEFAULT_USER_ID = '507f1f77bcf86cd799439011'; // Default user ID
const DEMO_USER_ID = '66c6cbc3e5bf7f1a2c8e123e'; // Demo user ID

// Get MongoDB URI
const MONGODB_URI = process.env.DB_URL || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: DB_URL or MONGODB_URI not found in environment variables');
  process.exit(1);
}

// TypeScript type assertion after validation
const DB_URI: string = MONGODB_URI;

// Define Meal schema directly in this script
const mealSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mealName: { type: String, required: true },
  imgSrc: { type: String, default: '' },
  tags: { type: [String], default: [] },
  ingredients: { type: [String], default: [] },
  directions: { type: [String], default: [] },
  cookbookTags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);

async function copyMealsToDemo() {
  try {
    console.log('🍽️  MealCreator - Copy Meals to Demo User\n');
    console.log('═══════════════════════════════════════════\n');

    console.log('🔌 Connecting to database...');
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to database\n');

    // Find all meals from default user
    console.log('🔍 Finding meals from default user...');
    const defaultUserMeals = await Meal.find({ userId: DEFAULT_USER_ID });
    console.log(`📊 Found ${defaultUserMeals.length} meals from default user\n`);

    if (defaultUserMeals.length === 0) {
      console.log('❌ No meals found for default user');
      await mongoose.disconnect();
      return;
    }

    // Check if demo user already has meals
    const existingDemoMeals = await Meal.find({ userId: DEMO_USER_ID });
    console.log(`📊 Demo user currently has ${existingDemoMeals.length} meals`);

    if (existingDemoMeals.length > 0) {
      console.log('\n⚠️  Demo user already has meals.');
      
      // Check for --clear flag
      const clearFlag = process.argv.includes('--clear');
      
      if (clearFlag) {
        console.log('🗑️  Clearing existing demo meals...');
        const deleteResult = await Meal.deleteMany({ userId: DEMO_USER_ID });
        console.log(`✅ Deleted ${deleteResult.deletedCount} meals from demo user\n`);
      } else {
        console.log('➕ Adding to existing meals (use --clear flag to delete existing first)\n');
      }
    }

    // Copy meals to demo user
    console.log('📋 Copying meals to demo user...');
    let copiedCount = 0;
    let errorCount = 0;

    for (const meal of defaultUserMeals) {
      try {
        // Create new meal document for demo user
        const newMeal = new Meal({
          userId: DEMO_USER_ID,
          mealName: meal.mealName,
          imgSrc: meal.imgSrc,
          tags: meal.tags,
          ingredients: meal.ingredients,
          directions: meal.directions,
          cookbookTags: meal.cookbookTags || [],
          createdAt: new Date(),
          updatedAt: new Date()
        });

        await newMeal.save();
        copiedCount++;
        
        if (copiedCount % 20 === 0) {
          console.log(`   Copied ${copiedCount}/${defaultUserMeals.length} meals...`);
        }
      } catch (err) {
        errorCount++;
        console.error(`   ❌ Error copying meal "${meal.mealName}":`, err);
      }
    }

    console.log('\n✅ Copy operation complete!');
    console.log(`   Successfully copied: ${copiedCount} meals`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount} meals`);
    }

    // Verify final count
    const finalDemoMeals = await Meal.find({ userId: DEMO_USER_ID });
    console.log(`\n📊 Demo user now has ${finalDemoMeals.length} total meals`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from database');

  } catch (error) {
    console.error('\n❌ Error during copy operation:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

copyMealsToDemo();
