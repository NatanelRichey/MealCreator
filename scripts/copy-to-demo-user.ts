// CRITICAL: Load environment variables BEFORE any other imports
import { config } from 'dotenv';
config({ path: '.env.local' });

// Now import everything else
import { connectDB } from '../lib/db';
import Meal from '../lib/models/Meal';

const DEFAULT_USER_ID = '507f1f77bcf86cd799439011'; // Default user ID
const DEMO_USER_ID = '66c6cbc3e5bf7f1a2c8e123e'; // Demo user ID

async function copyMealsToDemo() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database\n');

    // Find all meals from default user
    console.log('🔍 Finding meals from default user...');
    const defaultUserMeals = await Meal.find({ userId: DEFAULT_USER_ID });
    console.log(`📊 Found ${defaultUserMeals.length} meals from default user\n`);

    if (defaultUserMeals.length === 0) {
      console.log('❌ No meals found for default user');
      return;
    }

    // Check if demo user already has meals
    const existingDemoMeals = await Meal.find({ userId: DEMO_USER_ID });
    console.log(`📊 Demo user currently has ${existingDemoMeals.length} meals`);

    if (existingDemoMeals.length > 0) {
      console.log('\n⚠️  Demo user already has meals. Do you want to:');
      console.log('   1. Clear existing demo meals and copy fresh (will delete existing)');
      console.log('   2. Add to existing demo meals (may create duplicates)');
      console.log('   3. Cancel operation');
      console.log('\n⚠️  For safety, please manually confirm by running with --clear flag to delete existing meals\n');
      
      // Check for --clear flag
      const clearFlag = process.argv.includes('--clear');
      
      if (clearFlag) {
        console.log('🗑️  Clearing existing demo meals...');
        const deleteResult = await Meal.deleteMany({ userId: DEMO_USER_ID });
        console.log(`✅ Deleted ${deleteResult.deletedCount} meals from demo user\n`);
      } else {
        console.log('➕ Adding to existing meals (no deletion)\n');
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
        
        if (copiedCount % 10 === 0) {
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

  } catch (error) {
    console.error('❌ Error during copy operation:', error);
  } finally {
    process.exit(0);
  }
}

console.log('🍽️  MealCreator - Copy Meals to Demo User\n');
console.log('═══════════════════════════════════════════\n');
copyMealsToDemo();

