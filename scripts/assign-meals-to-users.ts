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

// Define Meal schema
const mealSchema = new mongoose.Schema({
  userId: String,
  mealName: String,
  imgSrc: String,
  tags: [String],
  ingredients: [String],
  directions: [String],
  cookbookTags: [String],
  createdAt: Date,
  updatedAt: Date
});

const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);

async function assignMealsToUsers() {
  try {
    console.log('🍽️  MealCreator - Assign Meals to Users\n');
    console.log('═══════════════════════════════════════════\n');

    console.log('🔌 Connecting to database...');
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to database\n');

    // Step 1: Assign all null userId meals to default user
    console.log('📝 Step 1: Assigning meals with null userId to default user...');
    const nullUserMeals = await Meal.find({ userId: null });
    console.log(`   Found ${nullUserMeals.length} meals with null userId`);
    
    if (nullUserMeals.length > 0) {
      const updateResult = await Meal.updateMany(
        { userId: null },
        { $set: { userId: DEFAULT_USER_ID } }
      );
      console.log(`   ✅ Updated ${updateResult.modifiedCount} meals to default user\n`);
    } else {
      console.log('   No meals to update\n');
    }

    // Step 2: Copy meals to demo user
    console.log('📋 Step 2: Copying meals to demo user...');
    const defaultUserMeals = await Meal.find({ userId: DEFAULT_USER_ID });
    console.log(`   Found ${defaultUserMeals.length} meals for default user`);

    // Check if demo user already has meals
    const existingDemoMeals = await Meal.find({ userId: DEMO_USER_ID });
    console.log(`   Demo user currently has ${existingDemoMeals.length} meals`);

    if (existingDemoMeals.length > 0) {
      console.log('   🗑️  Clearing existing demo meals...');
      const deleteResult = await Meal.deleteMany({ userId: DEMO_USER_ID });
      console.log(`   ✅ Deleted ${deleteResult.deletedCount} meals from demo user\n`);
    }

    // Copy meals
    console.log('   📋 Copying meals...');
    let copiedCount = 0;

    for (const meal of defaultUserMeals) {
      try {
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
          console.log(`      Copied ${copiedCount}/${defaultUserMeals.length} meals...`);
        }
      } catch (err) {
        console.error(`      ❌ Error copying meal "${meal.mealName}":`, err);
      }
    }

    console.log(`   ✅ Copied ${copiedCount} meals to demo user\n`);

    // Verify final counts
    const finalDefaultCount = await Meal.countDocuments({ userId: DEFAULT_USER_ID });
    const finalDemoCount = await Meal.countDocuments({ userId: DEMO_USER_ID });

    console.log('═══════════════════════════════════════════\n');
    console.log('✨ SUCCESS! Meal assignment complete!\n');
    console.log(`📊 Final counts:`);
    console.log(`   Default user: ${finalDefaultCount} meals`);
    console.log(`   Demo user: ${finalDemoCount} meals\n`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from database');

  } catch (error) {
    console.error('\n❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

assignMealsToUsers();

