import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Pantry from '@/lib/models/Pantry';
import ShoppingList from '@/lib/models/ShoppingList';

/**
 * POST /api/pantry/actions
 * 
 * Handle special pantry actions:
 * - move-to-cart: Move item from pantry to shopping list
 * - move-to-saved: Mark item as not in stock (saved for later)
 * - move-from-saved: Mark item as back in stock
 * 
 * Request body:
 * {
 *   action: "move-to-cart" | "move-to-saved" | "move-from-saved",
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

    switch (action) {
      case 'move-to-cart': {
        // Find the pantry item
        const item = await Pantry.findOne({ name, owner });
        
        if (!item) {
          return NextResponse.json(
            { error: 'Item not found in pantry' },
            { status: 404 }
          );
        }

        // Add to shopping list
        await ShoppingList.create({
          name,
          category: item.category,
          inStock: true,
          owner
        });

        // Delete from pantry
        await Pantry.deleteMany({ name, owner });

        console.log(`✅ Moved '${name}' from pantry to shopping list for user: ${owner}`);

        return NextResponse.json(
          { message: `'${name}' moved to shopping list successfully` },
          { status: 200 }
        );
      }

      case 'move-to-saved': {
        // Update inStock to false (saved items)
        const result = await Pantry.updateMany(
          { name, owner },
          { inStock: false }
        );

        if (result.matchedCount === 0) {
          return NextResponse.json(
            { error: 'Item not found' },
            { status: 404 }
          );
        }

        console.log(`✅ Moved '${name}' to saved items for user: ${owner}`);

        return NextResponse.json(
          { message: `'${name}' moved to saved items` },
          { status: 200 }
        );
      }

      case 'move-from-saved': {
        // Update inStock to true (back in pantry)
        const result = await Pantry.updateMany(
          { name, owner },
          { inStock: true }
        );

        if (result.matchedCount === 0) {
          return NextResponse.json(
            { error: 'Item not found' },
            { status: 404 }
          );
        }

        console.log(`✅ Moved '${name}' back to pantry from saved items for user: ${owner}`);

        return NextResponse.json(
          { message: `'${name}' moved back to pantry` },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be move-to-cart, move-to-saved, or move-from-saved' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('❌ Error performing pantry action:', error);

    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}

