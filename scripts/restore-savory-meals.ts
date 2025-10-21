// Restore the 3 savory meals that were incorrectly deleted
import { config } from 'dotenv';
config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import connectDB from '../lib/db';
import Meal from '../lib/models/Meal';

const COOKBOOK_YAML_DIR = path.join(process.cwd(), 'CookBook YAML');

const MEALS_TO_RESTORE = [
  'Moroccan Fish Cakes (ktzitzot Dagim)',
  'Stuffed Cabbage in Sweet Sauce',
  'Sweet meat balls'
];

async function restoreSavoryMeals() {
  await connectDB();
  
  console.log('🔄 Restoring 3 savory meals...\n');
  
  const allFiles = fs.readdirSync(COOKBOOK_YAML_DIR);
  let restored = 0;
  
  for (const mealName of MEALS_TO_RESTORE) {
    // Find the YAML file (name might have ID suffix)
    const matchingFile = allFiles.find(file => 
      file.includes(mealName.split(' (')[0]) && file.endsWith('.yml')
    );
    
    if (!matchingFile) {
      console.log(`⚠️  Could not find YAML file for: ${mealName}`);
      continue;
    }
    
    const filePath = path.join(COOKBOOK_YAML_DIR, matchingFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const recipe: any = yaml.load(fileContent);
    
    // Simple ingredient cleaning (just remove leading numbers)
    const cleanedIngredients = (recipe.ingredients || [])
      .map((ing: string) => {
        let cleaned = ing.trim()
          .replace(/^[\d\s.,\/\-]+/, '')
          .split(',')[0]
          .trim();
        
        // Title Case
        return cleaned.split(' ').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        ).join(' ');
      })
      .filter((ing: string) => ing.length > 0);
    
    const mealData = {
      mealName: recipe.name,
      description: recipe.notes || '',
      ingredients: cleanedIngredients,
      tags: [],
      cookbookTags: recipe.tags || [],
      instructions: '',
      imgSrc: recipe.image || 'https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg',
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      category: 'Other',
      owner: 'default',
      confirmed: true
    };
    
    await Meal.create(mealData);
    console.log(`✅ Restored: ${recipe.name}`);
    restored++;
  }
  
  console.log(`\n✅ Restored ${restored} savory meals!`);
  process.exit(0);
}

restoreSavoryMeals();


