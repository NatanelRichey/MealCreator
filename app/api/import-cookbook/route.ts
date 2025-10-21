import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Meal from '@/lib/models/Meal';

/**
 * POST /api/import-cookbook
 * 
 * Import recipes from CookBook Manager YAML export
 * Maps CookBook format to MealCreator format
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { recipes, targetUser } = body;

    if (!recipes || !Array.isArray(recipes)) {
      return NextResponse.json(
        { error: 'Invalid recipes data. Expected array of recipes.' },
        { status: 400 }
      );
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user is required' },
        { status: 400 }
      );
    }

    console.log(`📥 Importing ${recipes.length} recipes for user: ${targetUser}`);

    const importResults = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      imported: [] as any[]
    };

    // Process each recipe
    for (const recipe of recipes) {
      try {
        // Map CookBook fields to MealCreator fields
        const mealData = {
          mealName: recipe.name || recipe.title || 'Untitled Recipe',
          description: recipe.description || recipe.summary || '',
          ingredients: Array.isArray(recipe.ingredients) 
            ? recipe.ingredients 
            : recipe.ingredients?.split('\n').filter((i: string) => i.trim()) || [],
          tags: recipe.tags || recipe.categories || [],
          instructions: recipe.instructions || recipe.directions || recipe.method || '',
          imgSrc: recipe.image || recipe.imageUrl || recipe.photo || 
                 'https://res.cloudinary.com/meal-creator/image/upload/v1662460322/meal-images/untitled-meal.jpg',
          prepTime: recipe.prepTime || recipe.prep_time || 0,
          cookTime: recipe.cookTime || recipe.cook_time || 0,
          servings: recipe.servings || recipe.yields || 1,
          category: recipe.category || 'Other',
          owner: targetUser,
          confirmed: true,
          createdAt: new Date()
        };

        // Check if meal already exists (by name and owner)
        const existingMeal = await Meal.findOne({
          mealName: mealData.mealName,
          owner: targetUser
        });

        if (existingMeal) {
          console.log(`⚠️  Skipping duplicate: ${mealData.mealName}`);
          importResults.errors.push(`Duplicate: ${mealData.mealName} already exists`);
          importResults.failed++;
          continue;
        }

        // Create new meal
        const newMeal = await Meal.create(mealData);
        console.log(`✅ Imported: ${mealData.mealName}`);
        
        importResults.success++;
        importResults.imported.push({
          name: mealData.mealName,
          id: newMeal._id
        });

      } catch (error: any) {
        console.error(`❌ Error importing recipe:`, error);
        importResults.failed++;
        importResults.errors.push(
          `${recipe.name || 'Unknown'}: ${error.message}`
        );
      }
    }

    console.log(`
      📊 Import Summary:
      ✅ Success: ${importResults.success}
      ❌ Failed: ${importResults.failed}
      📝 Total: ${recipes.length}
    `);

    return NextResponse.json({
      message: 'Import completed',
      ...importResults
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error in import process:', error);
    return NextResponse.json(
      { error: 'Failed to import recipes', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/import-cookbook
 * 
 * Get import statistics
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const mealCount = await Meal.countDocuments({ owner: username });

    return NextResponse.json({
      username,
      mealCount,
      message: `User '${username}' has ${mealCount} meals`
    });

  } catch (error: any) {
    console.error('❌ Error getting stats:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}


