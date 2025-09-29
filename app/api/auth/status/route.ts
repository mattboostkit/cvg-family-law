// Authentication Status API Route
// Checks if user is authenticated and returns user info

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, User, AuthSession } from '@/types/client-portal';

// Mock sessions storage - In production, use Redis or database
const sessions = new Map<string, AuthSession>();

export async function GET(request: NextRequest) {
  try {
    // Get session cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/client-portal-session=([^;]+)/);
    const sessionToken = sessionMatch ? sessionMatch[1] : null;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Find session (mock implementation)
    let session = null;
    for (const sessionData of sessions.values()) {
      if (sessionData.token === sessionToken) {
        session = sessionData;
        break;
      }
    }

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      sessions.delete(session.id);
      return NextResponse.json(
        { success: false, error: 'Session expired' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Return user data (mock implementation)
    const user = {
      id: session.userId,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe'
    };

    return NextResponse.json(
      {
        success: true,
        data: { user, session }
      } as ApiResponse<{ user: Partial<User>; session: AuthSession }>,
      { status: 200 }
    );

  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<never>,
      { status: 500 }
    );
  }
}