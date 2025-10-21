import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ShoppingList from '@/lib/models/ShoppingList';

/**
 * GET /api/shopping-list/[id]
 * Get a single shopping list item
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const item = await ShoppingList.findById(id);

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error fetching shopping list item:', error);

    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid item ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/shopping-list/[id]
 * Update a shopping list item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const updates = await request.json();

    // Don't allow changing the owner
    delete updates.owner;

    const updatedItem = await ShoppingList.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Shopping list item updated: ${updatedItem.name}`);

    return NextResponse.json(
      {
        message: 'Item updated successfully',
        item: updatedItem
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error updating shopping list item:', error);

    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid item ID format' },
        { status: 400 }
      );
    }

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid item data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/shopping-list/[id]
 * Delete a shopping list item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const deletedItem = await ShoppingList.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Shopping list item deleted: ${deletedItem.name}`);

    return NextResponse.json(
      {
        message: 'Item deleted successfully',
        item: deletedItem
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error deleting shopping list item:', error);

    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid item ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}

