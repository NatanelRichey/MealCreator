import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * 
 * Simple logout - just clears client-side state
 * 
 * SIMPLIFIED: No sessions to destroy, frontend just clears user state
 */
export async function POST() {
  try {
    console.log('✅ User logged out');

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Logout error:', error);

    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
