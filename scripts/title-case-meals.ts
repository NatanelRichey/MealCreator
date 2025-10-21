// Convert all meal names to Title Case
import { config } from 'dotenv';
config({ path: '.env.local' });

import connectDB from '../lib/db';
import Meal from '../lib/models/Meal';

/**
 * Convert string to Title Case
 * "hello world" → "Hello World"
 * "HELLO WORLD" → "Hello World"
 */
function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

async function convertToTitleCase() {
  await connectDB();
  
  console.log('🔍 Finding all meals...\n');
  
  const meals = await Meal.find({ owner: 'default' });
  
  console.log(`📊 Found ${meals.length} meals\n`);
  console.log('Converting to Title Case...\n');
  
  let updated = 0;
  let unchanged = 0;
  
  for (const meal of meals) {
    const originalName = meal.mealName;
    const titleCaseName = toTitleCase(originalName);
    
    if (originalName !== titleCaseName) {
      meal.mealName = titleCaseName;
      await meal.save();
      console.log(`✅ "${originalName}" → "${titleCaseName}"`);
      updated++;
    } else {
      unchanged++;
    }
  }
  
  console.log(`\n
╔════════════════════════════════════════╗
║       TITLE CASE CONVERSION            ║
╠════════════════════════════════════════╣
║ ✅ Updated:   ${updated.toString().padEnd(26)} ║
║ ⏭️  Unchanged: ${unchanged.toString().padEnd(26)} ║
║ 📝 Total:     ${meals.length.toString().padEnd(26)} ║
╚════════════════════════════════════════╝
  `);
  
  process.exit(0);
}

convertToTitleCase();


