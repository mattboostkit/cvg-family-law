// Secure Login API Route
// Handles user authentication with security measures

import { NextRequest, NextResponse } from 'next/server';
import {
  User,
  AuthSession,
  LoginCredentials,
  ApiResponse,
  SecurityQuestion
} from '@/types/client-portal';
import {
  validatePasswordStrength,
  validateEmail,
  sanitiseInput,
  checkLoginRateLimit,
  clearLoginRateLimit,
  extractClientInfo,
  createAuthSession,
  createSessionCookie,
  logSecurityEvent
} from '@/lib/auth';

// Mock user database - In production, this would be a real database
const users = new Map<string, User & { password: string; securityQuestions: SecurityQuestion[] }>();

// Mock sessions storage - In production, use Redis or database
const sessions = new Map<string, AuthSession>();

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();
    const { email, password, rememberMe = false } = body;

    // Extract client information
    const clientInfo = extractClientInfo(request);

    // Sanitise and validate email
    const sanitisedEmail = sanitiseInput(email.toLowerCase());
    if (!validateEmail(sanitisedEmail)) {
      logSecurityEvent('login_failure', undefined, clientInfo.ipAddress, `Invalid email format: ${email}`);
      return NextResponse.json(
        { success: false, error: 'Invalid email format' } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // Check rate limiting
    const rateLimitCheck = checkLoginRateLimit(clientInfo.ipAddress);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please try again in ${Math.ceil((rateLimitCheck.waitTime || 1800) / 60)} minutes`
        } as ApiResponse<never>,
        { status: 429 }
      );
    }

    // Find user (mock implementation)
    const user = users.get(sanitisedEmail);
    if (!user) {
      logSecurityEvent('login_failure', undefined, clientInfo.ipAddress, `User not found: ${sanitisedEmail}`);
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Verify password (mock implementation)
    // In production, use proper password verification
    if (password !== 'mock-password') {
      logSecurityEvent('login_failure', user.id, clientInfo.ipAddress, 'Invalid password');
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Check if user has 2FA enabled
    if (user.twoFactorEnabled) {
      // Create temporary 2FA session
      const tempSession = createAuthSession(user.id, { rememberMe });
      sessions.set(tempSession.id, tempSession);

      return NextResponse.json(
        {
          success: true,
          data: {
            requires2FA: true,
            requiresSecurityQuestions: false
          }
        } as ApiResponse<{ requires2FA: boolean; requiresSecurityQuestions: boolean }>,
        {
          status: 200,
          headers: {
            'Set-Cookie': createSessionCookie(tempSession, rememberMe)
          }
        }
      );
    }

    // Check if user needs security questions (e.g., new device/location)
    const needsSecurityQuestions = await checkSecurityQuestionsRequired(user, clientInfo);
    if (needsSecurityQuestions) {
      const tempSession = createAuthSession(user.id, { rememberMe });
      sessions.set(tempSession.id, tempSession);

      return NextResponse.json(
        {
          success: true,
          data: {
            requires2FA: false,
            requiresSecurityQuestions: true
          }
        } as ApiResponse<{ requires2FA: boolean; requiresSecurityQuestions: boolean }>,
        {
          status: 200,
          headers: {
            'Set-Cookie': createSessionCookie(tempSession, rememberMe)
          }
        }
      );
    }

    // Full successful login
    const session = createAuthSession(user.id, { rememberMe });
    sessions.set(session.id, session);

    // Update user's last login
    user.lastLoginAt = new Date();

    // Clear rate limit on successful login
    clearLoginRateLimit(clientInfo.ipAddress);

    logSecurityEvent('login_success', user.id, clientInfo.ipAddress, 'Successful login');

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      } as ApiResponse<{ user: Partial<User> }>,
      {
        status: 200,
        headers: {
          'Set-Cookie': createSessionCookie(session, rememberMe)
        }
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * Checks if security questions are required for this login attempt
 */
async function checkSecurityQuestionsRequired(user: User, clientInfo: { ipAddress: string; userAgent: string }): Promise<boolean> {
  // Mock implementation - in production, check against known devices/locations
  // For demo purposes, randomly require security questions for some logins
  return Math.random() < 0.3; // 30% chance
}