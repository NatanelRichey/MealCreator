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

// Define schemas
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

const pantrySchema = new mongoose.Schema({
  userId: String,
  name: String,
  category: String,
  inStock: Boolean,
  quantity: Number,
  unit: String,
  addedDate: Date,
  createdAt: Date,
  updatedAt: Date
});

const shoppingListSchema = new mongoose.Schema({
  userId: String,
  name: String,
  category: String,
  checked: Boolean,
  inStock: Boolean,
  quantity: Number,
  unit: String,
  addedDate: Date,
  createdAt: Date,
  updatedAt: Date
});

const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);
const Pantry = mongoose.models.Pantry || mongoose.model('Pantry', pantrySchema);
const ShoppingList = mongoose.models.ShoppingList || mongoose.model('ShoppingList', shoppingListSchema);

async function completeDemoSetup() {
  try {
    console.log('🍽️  MealCreator - Complete Demo Account Setup\n');
    console.log('═══════════════════════════════════════════\n');

    console.log('🔌 Connecting to database...');
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to database\n');

    // ==================== FIX NULL USER IDs ====================
    console.log('🔧 Step 1: Fixing null userId entries...\n');

    // Fix Meals
    const nullMeals = await Meal.countDocuments({ userId: null });
    if (nullMeals > 0) {
      console.log(`   📝 Assigning ${nullMeals} meals with null userId to default user...`);
      await Meal.updateMany({ userId: null }, { $set: { userId: DEFAULT_USER_ID } });
      console.log('   ✅ Meals updated');
    }

    // Fix Pantry
    const nullPantry = await Pantry.countDocuments({ userId: null });
    if (nullPantry > 0) {
      console.log(`   📦 Assigning ${nullPantry} pantry items with null userId to default user...`);
      await Pantry.updateMany({ userId: null }, { $set: { userId: DEFAULT_USER_ID } });
      console.log('   ✅ Pantry updated');
    }

    // Fix Shopping List
    const nullShopping = await ShoppingList.countDocuments({ userId: null });
    if (nullShopping > 0) {
      console.log(`   🛒 Assigning ${nullShopping} shopping items with null userId to default user...`);
      await ShoppingList.updateMany({ userId: null }, { $set: { userId: DEFAULT_USER_ID } });
      console.log('   ✅ Shopping list updated');
    }

    console.log('\n');

    // ==================== COPY TO DEMO USER ====================
    console.log('📋 Step 2: Copying all data to demo user...\n');

    // Clear existing demo data
    const existingMeals = await Meal.countDocuments({ userId: DEMO_USER_ID });
    const existingPantry = await Pantry.countDocuments({ userId: DEMO_USER_ID });
    const existingShopping = await ShoppingList.countDocuments({ userId: DEMO_USER_ID });

    if (existingMeals > 0 || existingPantry > 0 || existingShopping > 0) {
      console.log('   🗑️  Clearing existing demo data...');
      await Meal.deleteMany({ userId: DEMO_USER_ID });
      await Pantry.deleteMany({ userId: DEMO_USER_ID });
      await ShoppingList.deleteMany({ userId: DEMO_USER_ID });
      console.log(`      Deleted: ${existingMeals} meals, ${existingPantry} pantry, ${existingShopping} shopping\n`);
    }

    // Copy Meals
    console.log('   📝 Copying meals...');
    const defaultMeals = await Meal.find({ userId: DEFAULT_USER_ID });
    let mealsCopied = 0;
    for (const meal of defaultMeals) {
      await new Meal({
        userId: DEMO_USER_ID,
        mealName: meal.mealName,
        imgSrc: meal.imgSrc,
        tags: meal.tags,
        ingredients: meal.ingredients,
        directions: meal.directions,
        cookbookTags: meal.cookbookTags,
        createdAt: new Date(),
        updatedAt: new Date()
      }).save();
      mealsCopied++;
    }
    console.log(`      ✅ Copied ${mealsCopied} meals`);

    // Copy Pantry
    console.log('   📦 Copying pantry items...');
    const defaultPantry = await Pantry.find({ userId: DEFAULT_USER_ID });
    let pantryCopied = 0;
    for (const item of defaultPantry) {
      await new Pantry({
        userId: DEMO_USER_ID,
        name: item.name,
        category: item.category,
        inStock: item.inStock,
        quantity: item.quantity,
        unit: item.unit,
        addedDate: item.addedDate || new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }).save();
      pantryCopied++;
    }
    console.log(`      ✅ Copied ${pantryCopied} pantry items`);

    // Copy Shopping List
    console.log('   🛒 Copying shopping list items...');
    const defaultShopping = await ShoppingList.find({ userId: DEFAULT_USER_ID });
    let shoppingCopied = 0;
    for (const item of defaultShopping) {
      await new ShoppingList({
        userId: DEMO_USER_ID,
        name: item.name,
        category: item.category,
        checked: item.checked,
        inStock: item.inStock,
        quantity: item.quantity,
        unit: item.unit,
        addedDate: item.addedDate || new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }).save();
      shoppingCopied++;
    }
    console.log(`      ✅ Copied ${shoppingCopied} shopping items\n`);

    // ==================== VERIFY ====================
    const finalDefaultMeals = await Meal.countDocuments({ userId: DEFAULT_USER_ID });
    const finalDefaultPantry = await Pantry.countDocuments({ userId: DEFAULT_USER_ID });
    const finalDefaultShopping = await ShoppingList.countDocuments({ userId: DEFAULT_USER_ID });

    const finalDemoMeals = await Meal.countDocuments({ userId: DEMO_USER_ID });
    const finalDemoPantry = await Pantry.countDocuments({ userId: DEMO_USER_ID });
    const finalDemoShopping = await ShoppingList.countDocuments({ userId: DEMO_USER_ID });

    console.log('═══════════════════════════════════════════\n');
    console.log('✨ SUCCESS! Demo account fully populated!\n');
    console.log('📊 Final Counts:\n');
    console.log('   Default User:');
    console.log(`      Meals: ${finalDefaultMeals}`);
    console.log(`      Pantry: ${finalDefaultPantry}`);
    console.log(`      Shopping: ${finalDefaultShopping}\n`);
    console.log('   Demo User:');
    console.log(`      Meals: ${finalDemoMeals}`);
    console.log(`      Pantry: ${finalDemoPantry}`);
    console.log(`      Shopping: ${finalDemoShopping}\n`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from database');

  } catch (error) {
    console.error('\n❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

completeDemoSetup();

