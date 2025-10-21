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

// Define Pantry schema
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

// Define Shopping List schema
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

const Pantry = mongoose.models.Pantry || mongoose.model('Pantry', pantrySchema);
const ShoppingList = mongoose.models.ShoppingList || mongoose.model('ShoppingList', shoppingListSchema);

async function copyPantryAndShoppingToDemo() {
  try {
    console.log('🛒 MealCreator - Copy Pantry & Shopping List to Demo\n');
    console.log('═══════════════════════════════════════════\n');

    console.log('🔌 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database\n');

    // ==================== PANTRY ====================
    console.log('📦 Processing Pantry Items...\n');

    // Find pantry items from default user
    const defaultPantryItems = await Pantry.find({ userId: DEFAULT_USER_ID });
    console.log(`   Found ${defaultPantryItems.length} pantry items for default user`);

    // Check if demo user already has pantry items
    const existingDemoPantry = await Pantry.find({ userId: DEMO_USER_ID });
    console.log(`   Demo user currently has ${existingDemoPantry.length} pantry items`);

    if (existingDemoPantry.length > 0) {
      console.log('   🗑️  Clearing existing demo pantry items...');
      const deleteResult = await Pantry.deleteMany({ userId: DEMO_USER_ID });
      console.log(`   ✅ Deleted ${deleteResult.deletedCount} pantry items\n`);
    }

    // Copy pantry items
    if (defaultPantryItems.length > 0) {
      console.log('   📋 Copying pantry items...');
      let copiedCount = 0;

      for (const item of defaultPantryItems) {
        try {
          const newItem = new Pantry({
            userId: DEMO_USER_ID,
            name: item.name,
            category: item.category,
            inStock: item.inStock,
            quantity: item.quantity,
            unit: item.unit,
            addedDate: item.addedDate || new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          });

          await newItem.save();
          copiedCount++;
        } catch (err) {
          console.error(`      ❌ Error copying pantry item "${item.name}":`, err);
        }
      }

      console.log(`   ✅ Copied ${copiedCount} pantry items to demo user\n`);
    } else {
      console.log('   ℹ️  No pantry items to copy\n');
    }

    // ==================== SHOPPING LIST ====================
    console.log('🛒 Processing Shopping List Items...\n');

    // Find shopping list items from default user
    const defaultShoppingItems = await ShoppingList.find({ userId: DEFAULT_USER_ID });
    console.log(`   Found ${defaultShoppingItems.length} shopping list items for default user`);

    // Check if demo user already has shopping list items
    const existingDemoShopping = await ShoppingList.find({ userId: DEMO_USER_ID });
    console.log(`   Demo user currently has ${existingDemoShopping.length} shopping list items`);

    if (existingDemoShopping.length > 0) {
      console.log('   🗑️  Clearing existing demo shopping list items...');
      const deleteResult = await ShoppingList.deleteMany({ userId: DEMO_USER_ID });
      console.log(`   ✅ Deleted ${deleteResult.deletedCount} shopping list items\n`);
    }

    // Copy shopping list items
    if (defaultShoppingItems.length > 0) {
      console.log('   📋 Copying shopping list items...');
      let copiedCount = 0;

      for (const item of defaultShoppingItems) {
        try {
          const newItem = new ShoppingList({
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
          });

          await newItem.save();
          copiedCount++;
        } catch (err) {
          console.error(`      ❌ Error copying shopping item "${item.name}":`, err);
        }
      }

      console.log(`   ✅ Copied ${copiedCount} shopping list items to demo user\n`);
    } else {
      console.log('   ℹ️  No shopping list items to copy\n');
    }

    // ==================== VERIFY FINAL COUNTS ====================
    const finalPantryCount = await Pantry.countDocuments({ userId: DEMO_USER_ID });
    const finalShoppingCount = await ShoppingList.countDocuments({ userId: DEMO_USER_ID });

    console.log('═══════════════════════════════════════════\n');
    console.log('✨ SUCCESS! All items copied to demo user!\n');
    console.log('📊 Demo User Final Counts:');
    console.log(`   Pantry items: ${finalPantryCount}`);
    console.log(`   Shopping list items: ${finalShoppingCount}\n`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from database');

  } catch (error) {
    console.error('\n❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

copyPantryAndShoppingToDemo();

