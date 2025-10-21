import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ShoppingList from '@/lib/models/ShoppingList';
import Pantry from '@/lib/models/Pantry';

/**
 * POST /api/shopping-list/actions
 * 
 * Handle special shopping list actions:
 * - move-to-pantry: Move item from shopping list to pantry
 * 
 * Request body:
 * {
 *   action: "move-to-pantry",
 *   name: string,
 *   owner: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { action, name, owner } = await request.json();

    if (!action || !name || !owner) {
      return NextResponse.json(
        { error: 'Action, name, and owner are required' },
        { status: 400 }
      );
    }

    if (action === 'move-to-pantry') {
      // Find the shopping list item
      const item = await ShoppingList.findOne({ name, owner });
      
      if (!item) {
        return NextResponse.json(
          { error: 'Item not found in shopping list' },
          { status: 404 }
        );
      }

      // Add to pantry
      await Pantry.create({
        name: item.name,
        category: item.category,
        owner,
        inStock: true
      });

      // Delete from shopping list
      await ShoppingList.deleteMany({ name, owner });

      console.log(`✅ Moved '${name}' from shopping list to pantry for user: ${owner}`);

      return NextResponse.json(
        { message: `'${name}' stocked in pantry successfully` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be move-to-pantry' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Error performing shopping list action:', error);

    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}

