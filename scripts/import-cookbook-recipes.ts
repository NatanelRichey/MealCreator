/**
 * COOKBOOK IMPORT SCRIPT
 * 
 * Imports recipes from CookBook Manager YAML files to MealCreator
 * 
 * Features:
 * - Cleans ingredients (removes numbers, converts to Title Case)
 * - Migrates images to YOUR Cloudinary account
 * - Stores CookBook tags in cookbookTags field (DB only, not displayed)
 * - Skips directions (per user request)
 * - Batch processing to avoid rate limits
 */

// CRITICAL: Load environment variables BEFORE any other imports
import { config } from 'dotenv';
config({ path: '.env.local' });

// Now import everything else
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import https from 'https';
import http from 'http';
import { v2 as cloudinarySDK } from 'cloudinary';

// Verify environment variables loaded
if (!process.env.DB_URL) {
  console.error('❌ DB_URL not found in environment variables');
  console.error('Make sure .env.local exists with DB_URL=...');
  process.exit(1);
}

// Configure Cloudinary directly here
cloudinarySDK.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

console.log('✅ Environment variables loaded');
console.log('✅ Cloudinary configured\n');

// Now safe to import modules that use env vars
import connectDB from '../lib/db';
import Meal from '../lib/models/Meal';

// Configuration
const COOKBOOK_YAML_DIR = path.join(process.cwd(), 'CookBook YAML');
const TARGET_USER = 'default';
const TEST_MODE = false;  // ✅ IMPORTING ALL RECIPES NOW!
const TEST_LIMIT = 5;     // Not used when TEST_MODE = false

/**
 * Clean ingredient string - ULTRA THOROUGH
 * - Removes ALL quantities, fractions, and measurements
 * - Handles "x or y" → keeps only "x"
 * - Converts to Title Case
 * - Only keeps the ingredient name
 */
function cleanIngredient(ingredient: string): string {
  let cleaned = ingredient.trim();
  
  // Skip empty strings
  if (!cleaned) return '';
  
  // Keep section headers (like "For the vinaigrette:")
  if (cleaned.startsWith('For the') || cleaned.endsWith(':')) {
    return cleaned;
  }
  
  // Remove unicode fractions (¼, ½, ¾, ⅓, ⅔, etc.)
  cleaned = cleaned.replace(/[¼½¾⅓⅔⅕⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒]/g, ' ');
  
  // Remove all numbers and fractions at the start (including decimals, slashes)
  cleaned = cleaned.replace(/^[\d\s.,\/\-]+/, '');
  
  // COMPREHENSIVE list of measurements to remove
  const measurements = [
    // Volume - ALL forms
    'cup', 'cups', 'c',
    'tablespoon', 'tablespoons', 'tbsp', 'tbs', 'tb',
    'teaspoon', 'teaspoons', 'tsp', 'ts',
    'milliliter', 'milliliters', 'ml', 'mls',
    'liter', 'liters', 'l', 'litre', 'litres',
    'fluid ounce', 'fluid ounces', 'fl oz', 'fl. oz.',
    'pint', 'pints', 'pt', 'quart', 'quarts', 'qt', 'gallon', 'gallons', 'gal',
    // Weight - ALL forms
    'ounce', 'ounces', 'oz',
    'pound', 'pounds', 'lb', 'lbs',
    'gram', 'grams', 'g', 'gm', 'gms',
    'kilogram', 'kilograms', 'kg', 'kilo', 'kilos',
    'milligram', 'milligrams', 'mg',
    // Count/Quantity
    'piece', 'pieces', 'pc', 'pcs',
    'slice', 'slices', 'clove', 'cloves',
    'ball', 'balls', 'bunch', 'bunches', 'head', 'heads',
    'can', 'cans', 'jar', 'jars', 'bottle', 'bottles',
    'package', 'packages', 'pkg', 'box', 'boxes',
    'stick', 'sticks', 'cube', 'cubes', 'sheet', 'sheets',
    // Cooking measurements
    'pinch', 'pinches', 'dash', 'dashes', 'splash', 'splashes',
    'squeeze', 'squeezes', 'handful', 'handfuls', 'palmful',
    'drop', 'drops', 'sprig', 'sprigs', 'stalk', 'stalks',
    // Sizes/Descriptors
    'large', 'medium', 'small', 'extra large', 'extra small',
    'big', 'little', 'tiny', 'huge', 'jumbo', 'mini',
    'about', 'approx', 'approximately', 'roughly', 'around',
    'heaping', 'scant', 'packed', 'generous', 'light',
    'to taste', 'as needed', 'optional',
    // Numbers as words
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'twenty', 'thirty'
  ];
  
  // Remove measurements from start (case insensitive)
  const removePattern = new RegExp(`^(${measurements.join('|')})\\s+`, 'gi');
  let previousCleaned = '';
  let iterations = 0;
  
  // Keep removing until nothing changes (max 10 iterations to avoid infinite loop)
  while (cleaned !== previousCleaned && iterations < 10) {
    previousCleaned = cleaned;
    cleaned = cleaned.replace(removePattern, '');
    cleaned = cleaned.replace(/^[\d\s.,\/\-]+/, ''); // Remove any numbers
    iterations++;
  }
  
  // Remove parenthetical quantities like "(200ml capacity)" or "(about 1 cup)"
  cleaned = cleaned.replace(/\([^)]*\)/g, '');
  
  // Handle "X or Y" or "X/Y" → keep only X (first option)
  if (cleaned.includes(' or ')) {
    cleaned = cleaned.split(' or ')[0].trim();
  }
  if (cleaned.includes('/') && !cleaned.includes('meal-creator')) {
    cleaned = cleaned.split('/')[0].trim();
  }
  
  // Split on commas and take only the first part (main ingredient before description)
  cleaned = cleaned.split(',')[0].trim();
  
  // Remove extra descriptive text after dashes
  cleaned = cleaned.split(' - ')[0].trim();
  
  // Clean up multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Skip if empty after all cleaning
  if (!cleaned) return '';
  
  // Convert to Title Case
  return cleaned
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Parse ISO 8601 duration to minutes
 * PT10M → 10
 * PT1H30M → 90
 */
function parseDuration(duration: string | undefined): number {
  if (!duration) return 0;
  
  const hourMatch = duration.match(/(\d+)H/);
  const minuteMatch = duration.match(/(\d+)M/);
  
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  
  return hours * 60 + minutes;
}

/**
 * Extract servings number from string
 * "2 servings" → 2
 * "6 people" → 6
 */
function parseServings(servings: string | undefined): number {
  if (!servings) return 1;
  const match = servings.match(/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

/**
 * Download image from URL and upload to Cloudinary
 */
async function migrateImageToCloudinary(imageUrl: string, recipeName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const protocol = imageUrl.startsWith('https') ? https : http;
      
      protocol.get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          console.log(`⚠️  Failed to download image for ${recipeName}, using default`);
          resolve('https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg');
          return;
        }

        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            
            // Generate a safe filename from recipe name
            const safeFileName = recipeName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
              .substring(0, 50);

            // Upload to Cloudinary
            const uploadResult = await cloudinarySDK.uploader.upload(
              `data:image/jpeg;base64,${buffer.toString('base64')}`,
              {
                folder: 'cookbook-imports',
                public_id: safeFileName,
                overwrite: false,
                transformation: [
                  { width: 800, height: 800, crop: 'fill' },
                  { quality: 'auto' },
                  { fetch_format: 'auto' }
                ]
              }
            );

            console.log(`✅ Uploaded image for: ${recipeName}`);
            resolve(uploadResult.secure_url);
            
          } catch (uploadError) {
            console.error(`❌ Cloudinary upload failed for ${recipeName}:`, uploadError);
            resolve('https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg');
          }
        });
      }).on('error', (err) => {
        console.error(`❌ Download error for ${recipeName}:`, err);
        resolve('https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg');
      });
      
    } catch (error) {
      console.error(`❌ Error migrating image for ${recipeName}:`, error);
      resolve('https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg');
    }
  });
}

/**
 * Main import function
 */
async function importCookBookRecipes() {
  console.log('🚀 Starting CookBook recipe import...\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Read all YAML files
    const files = fs.readdirSync(COOKBOOK_YAML_DIR)
      .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));

    console.log(`📁 Found ${files.length} recipe files\n`);

    const filesToProcess = TEST_MODE ? files.slice(0, TEST_LIMIT) : files;
    console.log(`📋 Processing ${filesToProcess.length} recipes${TEST_MODE ? ' (TEST MODE)' : ''}...\n`);

    const results = {
      success: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const file of filesToProcess) {
      try {
        const filePath = path.join(COOKBOOK_YAML_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const recipe: any = yaml.load(fileContent);

        console.log(`\n📝 Processing: ${recipe.name || file}`);

        // Check for duplicate
        const existing = await Meal.findOne({
          mealName: recipe.name,
          owner: TARGET_USER
        });

        if (existing) {
          console.log(`  ⏭️  Skipped (duplicate): ${recipe.name}`);
          results.skipped++;
          continue;
        }

        // Clean ingredients
        const cleanedIngredients = (recipe.ingredients || [])
          .map((ing: string) => cleanIngredient(ing))
          .filter((ing: string) => ing.length > 0);

        // Migrate image if exists
        let imgSrc = 'https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg';
        if (recipe.image && !recipe.image.includes('default/baked.png')) {
          console.log(`  📸 Migrating image from: ${recipe.image}`);
          imgSrc = await migrateImageToCloudinary(recipe.image, recipe.name);
          console.log(`  ✅ Image saved to: ${imgSrc}`);
        } else {
          console.log(`  ℹ️  No custom image, using default`);
        }

        // Create meal document
        const mealData = {
          mealName: recipe.name || 'Untitled Recipe',
          description: recipe.notes || '',
          ingredients: cleanedIngredients,
          tags: [],  // Empty - not using this
          cookbookTags: recipe.tags || [],  // Store CookBook tags here
          instructions: '',  // Not migrating directions
          imgSrc: imgSrc,
          prepTime: parseDuration(recipe.prep_time),
          cookTime: parseDuration(recipe.cook_time),
          servings: parseServings(recipe.servings),
          category: 'Other',
          owner: TARGET_USER,
          confirmed: true
        };

        await Meal.create(mealData);
        console.log(`  ✅ Imported: ${recipe.name}`);
        results.success++;

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: any) {
        console.error(`  ❌ Error processing ${file}:`, error.message);
        results.failed++;
        results.errors.push(`${file}: ${error.message}`);
      }
    }

    // Print summary
    console.log(`\n
╔════════════════════════════════════════╗
║       IMPORT SUMMARY                   ║
╠════════════════════════════════════════╣
║ ✅ Success:  ${results.success.toString().padEnd(25)} ║
║ ⏭️  Skipped:  ${results.skipped.toString().padEnd(25)} ║
║ ❌ Failed:   ${results.failed.toString().padEnd(25)} ║
║ 📝 Total:    ${filesToProcess.length.toString().padEnd(25)} ║
╚════════════════════════════════════════╝
    `);

    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(err => console.log(`  - ${err}`));
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run import
importCookBookRecipes();

