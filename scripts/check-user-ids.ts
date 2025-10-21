// CRITICAL: Load environment variables BEFORE any other imports
import { config } from 'dotenv';
config({ path: '.env.local' });

import mongoose from 'mongoose';

// Get MongoDB URI
const MONGODB_URI = process.env.DB_URL || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: DB_URL or MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Define Meal schema
const mealSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mealName: { type: String, required: true },
  imgSrc: String,
  tags: [String],
  ingredients: [String],
  directions: [String],
  cookbookTags: [String],
  createdAt: Date,
  updatedAt: Date
}, { collection: 'meals' });

const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);

async function checkUserIds() {
  try {
    console.log('🔍 Checking User IDs in Database\n');
    console.log('═══════════════════════════════════════════\n');

    console.log('🔌 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database\n');

    // Get total meal count
    const totalMeals = await Meal.countDocuments();
    console.log(`📊 Total meals in database: ${totalMeals}\n`);

    if (totalMeals === 0) {
      console.log('❌ No meals found in database');
      await mongoose.disconnect();
      return;
    }

    // Get all unique user IDs and count meals per user
    const userStats = await Meal.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          sampleMeals: { $push: '$mealName' }
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          sampleMeals: { $slice: ['$sampleMeals', 3] } // Show first 3 meal names
        }
      }
    ]);

    console.log('👥 Users and Meal Counts:\n');
    userStats.forEach((user) => {
      console.log(`User ID: ${user._id}`);
      console.log(`  Meals: ${user.count}`);
      console.log(`  Sample meals: ${user.sampleMeals.join(', ')}`);
      console.log('');
    });

    // Check the specific user IDs we're looking for
    const DEFAULT_USER_ID = '507f1f77bcf86cd799439011';
    const DEMO_USER_ID = '66c6cbc3e5bf7f1a2c8e123e';

    console.log('🎯 Checking specific user IDs:\n');
    
    const defaultCount = await Meal.countDocuments({ userId: DEFAULT_USER_ID });
    console.log(`Default User (${DEFAULT_USER_ID}): ${defaultCount} meals`);
    
    const demoCount = await Meal.countDocuments({ userId: DEMO_USER_ID });
    console.log(`Demo User (${DEMO_USER_ID}): ${demoCount} meals\n`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from database');

  } catch (error) {
    console.error('\n❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkUserIds();

