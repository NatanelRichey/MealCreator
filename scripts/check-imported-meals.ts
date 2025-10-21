// Check imported meals
import { config } from 'dotenv';
config({ path: '.env.local' });

import connectDB from '../lib/db';
import Meal from '../lib/models/Meal';

async function checkMeals() {
  await connectDB();
  
  const meals = await Meal.find({ owner: 'default' }).sort({ mealName: 1 });
  
  console.log(`\n📊 Found ${meals.length} meals for 'default' user:\n`);
  
  meals.forEach((meal, idx) => {
    console.log(`${idx + 1}. ${meal.mealName}`);
    console.log(`   ID: ${meal._id}`);
    console.log(`   Ingredients: ${meal.ingredients.length} items`);
    console.log(`   First 3: ${meal.ingredients.slice(0, 3).join(', ')}`);
    console.log(`   Image: ${meal.imgSrc.substring(0, 80)}...`);
    console.log(`   CookBook Tags: ${meal.cookbookTags?.join(', ') || 'none'}`);
    console.log('');
  });
  
  process.exit(0);
}

checkMeals();


