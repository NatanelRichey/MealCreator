import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ShoppingList from '@/lib/models/ShoppingList';
import Pantry from '@/lib/models/Pantry';

/**
 * GET /api/shopping-list
 * 
 * Get all shopping list items for a user
 * 
 * Query params: ?username=default|demo
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const items = await ShoppingList.find({ owner: username }).sort({ category: 1, name: 1 });

    // Group items by category for frontend
    const categories: { [key: string]: any[] } = {};

    items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    console.log(`✅ Found ${items.length} shopping list items for user: ${username}`);

    return NextResponse.json(
      { categories, count: items.length },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error fetching shopping list items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shopping list items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shopping-list
 * 
 * Add a new item to shopping list
 * 
 * Request body:
 * {
 *   name: string,
 *   category: string,
 *   owner: string,
 *   inStock?: boolean,
 *   checked?: boolean,
 *   quantity?: number,
 *   unit?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, category, owner, ...otherFields } = body;

    if (!name || !category || !owner) {
      return NextResponse.json(
        { error: 'Name, category, and owner are required' },
        { status: 400 }
      );
    }

    const newItem = await ShoppingList.create({
      name,
      category,
      owner,
      inStock: false,
      checked: false,
      ...otherFields
    });

    console.log(`✅ Shopping list item added: ${name} for user: ${owner}`);

    return NextResponse.json(
      {
        message: 'Item added to shopping list successfully',
        item: newItem
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Error adding shopping list item:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid item data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add item to shopping list' },
      { status: 500 }
    );
  }
}

