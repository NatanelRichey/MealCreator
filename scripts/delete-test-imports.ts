// Delete the 5 test imported meals
import { config } from 'dotenv';
config({ path: '.env.local' });

import connectDB from '../lib/db';
import Meal from '../lib/models/Meal';

const testMealNames = [
  'A good chicken salad',
  'Amaretto Bundt Cake',
  'Andouille Sausage Links, Cajun Style',
  'Ashkenaz Purple Cabbage salad',
  'Aubergine Olive'
];

async function deleteTestMeals() {
  await connectDB();
  
  for (const name of testMealNames) {
    const result = await Meal.deleteOne({ mealName: name, owner: 'default' });
    console.log(`${result.deletedCount > 0 ? '✅' : '⏭️ '} ${name}`);
  }
  
  console.log('\n✅ Test meals deleted');
  process.exit(0);
}

deleteTestMeals();


