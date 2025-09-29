// Two-Factor Authentication Verification API Route
// Handles 2FA code verification

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, User, AuthSession } from '@/types/client-portal';
import {
  extractClientInfo,
  validateTwoFactorCode,
  logSecurityEvent
} from '@/lib/auth';

// Mock sessions storage - In production, use Redis or database
const sessions = new Map<string, AuthSession & { secret?: string }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    // Extract client information
    const clientInfo = extractClientInfo(request);

    // Get session cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/client-portal-session=([^;]+)/);
    const sessionToken = sessionMatch ? sessionMatch[1] : null;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session found' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Find session (mock implementation)
    let session: (AuthSession & { secret?: string }) | null = null;
    for (const [id, sessionData] of sessions.entries()) {
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

    // Validate 2FA code
    if (!code || !validateTwoFactorCode(session.secret || 'mock-secret', code)) {
      logSecurityEvent('login_failure', session.userId, clientInfo.ipAddress, 'Invalid 2FA code');
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Mark 2FA as verified
    session.twoFactorVerified = true;
    sessions.set(session.id, session);

    logSecurityEvent('login_success', session.userId, clientInfo.ipAddress, '2FA verification successful');

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
        data: { user }
      } as ApiResponse<{ user: Partial<User> }>,
      { status: 200 }
    );

  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<never>,
      { status: 500 }
    );
  }
}