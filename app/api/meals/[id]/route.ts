import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Meal from '@/lib/models/Meal';

/**
 * GET /api/meals/[id]
 * 
 * Get a single meal by ID
 * 
 * CONVERTED FROM EXPRESS:
 * - Express: Multiple routes for different purposes
 * - Next.js: Single route, simpler pattern
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Get meal ID from URL parameter
    const { id } = params;

    // 3. Find meal by ID
    const meal = await Meal.findById(id);

    if (!meal) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }

    // 4. Normalize tags to lowercase for frontend
    const normalizedMeal = {
      ...meal.toObject(),
      tags: meal.tags.map(tag => tag.toLowerCase())
    };

    // 5. Return meal
    return NextResponse.json(
      { meal: normalizedMeal },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error fetching meal:', error);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid meal ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch meal' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/meals/[id]
 * 
 * Update a meal
 * 
 * CONVERTED FROM EXPRESS:
 * - Express: routes/meals.js → router.put('/edit/all/:name')
 * - Controller: controllers/meals.js → editMeal()
 * 
 * KEY DIFFERENCES:
 * 1. Express finds by name, Next.js finds by ID (more standard)
 * 2. Express handles Cloudinary image updates
 * 3. Next.js will handle images separately (or use Cloudinary API)
 * 
 * Request body: Same as POST, all fields optional
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Get meal ID from URL parameter
    const { id } = params;

    // 3. Parse request body
    const updates = await request.json();

    // 4. Don't allow changing the owner
    delete updates.owner;

    // 5. Capitalize tags if they're being updated
    if (updates.tags && Array.isArray(updates.tags)) {
      updates.tags = updates.tags.map((tag: string) => 
        tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
      );
    }

    // 6. Update meal
    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      updates,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validation
      }
    );

    if (!updatedMeal) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Meal updated: ${updatedMeal.mealName}`);

    // 7. Normalize tags for frontend
    const normalizedMeal = {
      ...updatedMeal.toObject(),
      tags: updatedMeal.tags.map(tag => tag.toLowerCase())
    };

    // 8. Return updated meal
    return NextResponse.json(
      {
        message: 'Meal updated successfully',
        meal: normalizedMeal
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error updating meal:', error);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid meal ID format' },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid meal data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update meal' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/meals/[id]
 * 
 * Delete a meal
 * 
 * CONVERTED FROM EXPRESS:
 * - Express: routes/meals.js → router.delete('/delete/:id')
 * - Controller: controllers/meals.js → deleteMeal()
 * 
 * KEY DIFFERENCES:
 * 1. Express deletes Cloudinary image automatically
 * 2. Next.js will need to handle Cloudinary deletion separately
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Get meal ID from URL parameter
    const { id } = params;

    // 3. Find and delete meal
    const deletedMeal = await Meal.findByIdAndDelete(id);

    if (!deletedMeal) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }

    // TODO: Delete Cloudinary image if not default image
    // const publicId = getPublicIdFromUrl(deletedMeal.imgSrc);
    // if (publicId !== 'meal-images/untitled-meal') {
    //   await cloudinary.uploader.destroy(publicId);
    // }

    console.log(`✅ Meal deleted: ${deletedMeal.mealName}`);

    // 4. Return success
    return NextResponse.json(
      {
        message: 'Meal deleted successfully',
        meal: deletedMeal
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error deleting meal:', error);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid meal ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete meal' },
      { status: 500 }
    );
  }
}

