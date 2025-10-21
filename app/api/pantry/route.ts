import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Pantry from '@/lib/models/Pantry';
import ShoppingList from '@/lib/models/ShoppingList';

/**
 * GET /api/pantry
 * 
 * Get all pantry items for a user
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

    const items = await Pantry.find({ owner: username }).sort({ category: 1, name: 1 });

    // Group items by category for frontend
    const categories: { [key: string]: any[] } = {};
    const savedItems: any[] = [];

    items.forEach(item => {
      if (item.inStock === false) {
        savedItems.push(item);
      } else {
        if (!categories[item.category]) {
          categories[item.category] = [];
        }
        categories[item.category].push(item);
      }
    });

    console.log(`✅ Found ${items.length} pantry items for user: ${username}`);

    return NextResponse.json(
      { categories, savedItems, count: items.length },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error fetching pantry items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pantry items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pantry
 * 
 * Add a new item to pantry
 * 
 * Request body:
 * {
 *   name: string,
 *   category: string,
 *   owner: string,
 *   inStock?: boolean,
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

    const newItem = await Pantry.create({
      name,
      category,
      owner,
      inStock: true,
      ...otherFields
    });

    console.log(`✅ Pantry item added: ${name} for user: ${owner}`);

    return NextResponse.json(
      {
        message: 'Item added to pantry successfully',
        item: newItem
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Error adding pantry item:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid item data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add item to pantry' },
      { status: 500 }
    );
  }
}

