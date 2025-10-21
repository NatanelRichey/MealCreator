import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Meal from '@/lib/models/Meal';
import Pantry from '@/lib/models/Pantry';

/**
 * POST /api/meals/find
 * 
 * Find meals that match user's criteria and available ingredients
 * 
 * CONVERTED FROM EXPRESS:
 * - Express: routes/app.js → router.post('/find-meals')
 * - Controller: controllers/app.js → processMealSelection()
 * 
 * This endpoint filters meals based on:
 * 1. Tags (health: healthy/regular, mealtime: breakfast/lunch/dinner, genre: dairy/parve/meaty)
 * 2. Available ingredients in user's pantry
 * 
 * Request body:
 * {
 *   owner: string,
 *   health?: string,      // "healthy" or "regular" (optional for surprise)
 *   mealtime?: string,    // "breakfast", "lunch", or "dinner" (optional for surprise)
 *   genre?: string,       // "dairy", "parve", or "meaty" (optional for surprise)
 *   surprise?: boolean    // If true, matches all tag categories
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { owner, health, mealtime, genre, surprise } = await request.json();

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner is required' },
        { status: 400 }
      );
    }

    // Build choices array
    let choices: string[] = [];
    
    if (surprise) {
      // Surprise mode - match all possible tags
      choices = ["healthy", "regular", "breakfast", "lunch", "dinner", "dairy", "parve", "meaty"];
    } else {
      // Add selected choices (convert to lowercase)
      if (health) choices.push(health.toLowerCase());
      if (mealtime) choices.push(mealtime.toLowerCase());
      if (genre) choices.push(genre.toLowerCase());
    }

    // Get user's meals and pantry items
    const meals = await Meal.find({ owner, confirmed: true });
    const pantryItems = await Pantry.find({ inStock: true, owner });

    // Build array of available ingredient names
    const availableIngredients = pantryItems.map(item => item.name.toLowerCase());

    // Filter meals
    const matchedMeals = meals.filter(meal => {
      // Sort tags into categories
      const sortedTags = sortTags(meal.tags);

      // Check if meal matches tag criteria
      let healthMatch = false;
      let mealtimeMatch = false;
      let genreMatch = false;

      for (const choice of choices) {
        const lowerChoice = choice.toLowerCase();
        if (sortedTags.healthTags.includes(lowerChoice)) healthMatch = true;
        if (sortedTags.mealTags.includes(lowerChoice)) mealtimeMatch = true;
        if (sortedTags.genreTags.includes(lowerChoice)) genreMatch = true;
      }

      // Check if user has all required ingredients
      let hasAllIngredients = true;
      for (const ingredient of meal.ingredients) {
        const lowerIngredient = ingredient.toLowerCase();
        
        // Check exact match, plural form, or singular form
        const hasIngredient = availableIngredients.includes(lowerIngredient) ||
                             availableIngredients.includes(lowerIngredient + 's') ||
                             availableIngredients.includes(lowerIngredient.slice(0, -1));
        
        if (!hasIngredient) {
          hasAllIngredients = false;
          break;
        }
      }

      // Meal must match all criteria
      return healthMatch && mealtimeMatch && genreMatch && hasAllIngredients;
    });

    // Normalize tags to lowercase for frontend
    const normalizedMeals = matchedMeals.map(meal => ({
      ...meal.toObject(),
      tags: meal.tags.map(tag => tag.toLowerCase())
    }));

    console.log(`✅ Found ${matchedMeals.length} matching meals for user: ${owner}`);

    return NextResponse.json(
      {
        meals: normalizedMeals,
        count: matchedMeals.length,
        criteria: {
          health,
          mealtime,
          genre,
          surprise
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error finding meals:', error);
    return NextResponse.json(
      { error: 'Failed to find meals' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to sort tags into categories
 */
function sortTags(tags: string[]): {
  healthTags: string[];
  mealTags: string[];
  genreTags: string[];
} {
  const sortedTags = {
    healthTags: [] as string[],
    mealTags: [] as string[],
    genreTags: [] as string[]
  };

  for (const tag of tags) {
    const lowerTag = tag.toLowerCase();
    
    if (lowerTag === "healthy" || lowerTag === "regular") {
      sortedTags.healthTags.push(lowerTag);
    } else if (lowerTag === "breakfast" || lowerTag === "lunch" || lowerTag === "dinner") {
      sortedTags.mealTags.push(lowerTag);
    } else if (lowerTag === "dairy" || lowerTag === "parve" || lowerTag === "meaty") {
      sortedTags.genreTags.push(lowerTag);
    }
  }

  return sortedTags;
}

