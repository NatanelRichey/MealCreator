import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Meal from '@/lib/models/Meal';

/**
 * GET /api/meals
 * 
 * Get all meals for the current user
 * 
 * CONVERTED FROM EXPRESS:
 * - Express: routes/meals.js → router.get('/')
 * - Controller: controllers/meals.js → renderMeals()
 * 
 * KEY DIFFERENCES:
 * 1. Express uses req.user (from Passport session) to get current user
 * 2. Next.js will need to get user from request headers/cookies/JWT
 * 3. Express renders EJS template
 * 4. Next.js returns JSON for React frontend
 * 
 * FOR NOW: We'll use a query parameter ?username=... until we add auth
 * LATER: We'll get username from JWT/session token
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Get username from query parameter (TEMPORARY until we add auth middleware)
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // 3. Delete unconfirmed meals (same as Express version)
    await Meal.deleteMany({ confirmed: false, owner: username });

    // 4. Find all confirmed meals for this user, sorted by name
    const meals = await Meal.find({ owner: username }).sort({ mealName: 1 });

    // 5. Normalize tags to lowercase for frontend compatibility
    const normalizedMeals = meals.map(meal => ({
      ...meal.toObject(),
      tags: meal.tags.map(tag => tag.toLowerCase())
    }));

    console.log(`✅ Found ${meals.length} meals for user: ${username}`);

    // 6. Return meals
    return NextResponse.json(
      {
        meals: normalizedMeals,
        count: meals.length
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error fetching meals:', error);

    return NextResponse.json(
      { error: 'Failed to fetch meals' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/meals
 * 
 * Create a new meal
 * 
 * CONVERTED FROM EXPRESS:
 * - Express: routes/meals.js → router.post('/new/:name')
 * - Controller: controllers/meals.js → addMeal()
 * 
 * KEY DIFFERENCES:
 * 1. Express uses Multer middleware for image upload
 * 2. Next.js will handle image upload separately (next step)
 * 3. Express has complex form state management
 * 4. Next.js receives complete meal data in one request
 * 
 * Request body:
 * {
 *   mealName: string,
 *   ingredients: string[],
 *   tags: string[],
 *   description?: string,
 *   instructions?: string,
 *   imgSrc?: string,
 *   prepTime?: number,
 *   cookTime?: number,
 *   servings?: number,
 *   owner: string  (TEMPORARY - will come from auth token later)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Parse request body
    const body = await request.json();
    const { mealName, ingredients, tags, owner, ...otherFields } = body;

    // 3. Validate required fields
    if (!mealName) {
      return NextResponse.json(
        { error: 'Meal name is required' },
        { status: 400 }
      );
    }

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner is required' },
        { status: 400 }
      );
    }

    // 4. Capitalize tags for database consistency
    const capitalizedTags = (tags || []).map((tag: string) => 
      tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
    );

    // 5. Create meal
    const newMeal = await Meal.create({
      mealName,
      ingredients: ingredients || [],
      tags: capitalizedTags,
      owner,
      confirmed: true, // Mark as confirmed (not a draft)
      ...otherFields
    });

    console.log(`✅ Meal created: ${mealName} for user: ${owner}`);

    // 6. Return created meal with normalized tags
    const normalizedMeal = {
      ...newMeal.toObject(),
      tags: newMeal.tags.map(tag => tag.toLowerCase())
    };

    // 7. Return created meal
    return NextResponse.json(
      {
        message: 'Meal created successfully',
        meal: normalizedMeal
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Error creating meal:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid meal data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create meal' },
      { status: 500 }
    );
  }
}

