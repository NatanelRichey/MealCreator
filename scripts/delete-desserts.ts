// Delete dessert meals (cookies, cakes, etc.)
import { config } from 'dotenv';
config({ path: '.env.local' });

import connectDB from '../lib/db';
import Meal from '../lib/models/Meal';

// Keywords that indicate desserts
const DESSERT_KEYWORDS = [
  'cake', 'cakes', 'cookie', 'cookies', 'brownie', 'brownies',
  'dessert', 'desserts', 'sweet', 'sweets', 'baked goods',
  'chocolate', 'mousse', 'cheesecake', 'pie', 'tart',
  'muffin', 'muffins', 'donut', 'doughnut', 'pastry', 'pastries',
  'cupcake', 'cupcakes', 'macaron', 'macaroons', 'truffle', 'truffles',
  'fudge', 'caramel', 'candy', 'brittle', 'slice'
];

async function deleteDesserts() {
  await connectDB();
  
  console.log('🔍 Finding dessert meals...\n');
  
  // Find all meals for default user
  const allMeals = await Meal.find({ owner: 'default' });
  
  // Filter desserts based on name or cookbookTags
  const dessertMeals = allMeals.filter(meal => {
    const mealNameLower = meal.mealName.toLowerCase();
    const tags = (meal.cookbookTags || []).join(' ').toLowerCase();
    
    return DESSERT_KEYWORDS.some(keyword => 
      mealNameLower.includes(keyword) || tags.includes(keyword)
    );
  });
  
  console.log(`📊 Found ${dessertMeals.length} dessert meals:\n`);
  
  dessertMeals.forEach((meal, idx) => {
    console.log(`${idx + 1}. ${meal.mealName}`);
    console.log(`   Tags: ${meal.cookbookTags?.join(', ') || 'none'}`);
    console.log('');
  });
  
  console.log(`\n❓ About to delete ${dessertMeals.length} dessert meals.`);
  console.log(`📝 Keeping ${allMeals.length - dessertMeals.length} non-dessert meals.\n`);
  
  // Delete all dessert meals
  const deleteResult = await Meal.deleteMany({
    _id: { $in: dessertMeals.map(m => m._id) }
  });
  
  console.log(`✅ Deleted ${deleteResult.deletedCount} dessert meals!`);
  console.log(`📊 Remaining meals: ${allMeals.length - dessertMeals.length}\n`);
  
  process.exit(0);
}

deleteDesserts();


