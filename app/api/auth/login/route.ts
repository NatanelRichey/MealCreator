import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

/**
 * POST /api/auth/login
 * 
 * Simple login - only 2 users: "default" and "demo"
 * No password required, just click to login!
 * 
 * SIMPLIFIED FROM EXPRESS:
 * - No password verification
 * - No registration
 * - Just 2 fixed users
 * 
 * Request body:
 * {
 *   username: "default" | "demo"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Parse request body
    const { username } = await request.json();

    // 3. Validate username
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // 4. Only allow "default" or "demo" users
    if (username !== 'default' && username !== 'demo') {
      return NextResponse.json(
        { error: 'Invalid user. Only "default" or "demo" are allowed.' },
        { status: 400 }
      );
    }

    // 5. Find or create the user
    let user = await User.findOne({ username });

    if (!user) {
      // Create the user if they don't exist
      user = await User.create({
        username,
        email: `${username}@mealcreator.com`
      });
      console.log(`✅ Created user: ${username}`);
    }

    console.log(`✅ User logged in: ${username}`);

    // 6. Return user data
    // TODO: In the future, we can set a session cookie here
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Login error:', error);

    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
