// Authentication Utilities for Client Portal
// Handles secure authentication, session management, and user validation

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  User,
  AuthSession,
  LoginCredentials,
  TwoFactorSetup,
  SecurityQuestion,
  ApiResponse
} from '@/types/client-portal';
import {
  generateSessionToken,
  hashPassword,
  verifyPassword,
  generateEncryptionKey,
  encryptData,
  decryptData,
  encryptSecurityQuestion,
  decryptSecurityQuestion
} from './encryption';

// Session configuration
const SESSION_COOKIE_NAME = 'client-portal-session';
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const EXTENDED_SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days for "remember me"
const TWO_FACTOR_COOKIE_NAME = 'client-portal-2fa';

/**
 * Validates password strength according to security requirements
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  } else if (password.length >= 16) {
    score += 2;
  } else {
    score += 1;
  }

  // Character variety checks
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Common patterns to avoid
  const commonPatterns = [
    /(.)\1{2,}/, // Repeated characters
    /123456/, // Sequential numbers
    /abcdef/, // Sequential letters
    /qwerty/i, // Keyboard patterns
    /password/i, // Common words
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns that make it less secure');
      score -= 1;
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.max(0, score)
  };
}

/**
 * Generates a secure session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Creates a new authentication session
 */
export function createAuthSession(
  userId: string,
  options: {
    rememberMe?: boolean;
    twoFactorVerified?: boolean;
  } = {}
): AuthSession {
  const sessionId = generateSessionId();
  const expiresAt = new Date(
    Date.now() + (options.rememberMe ? EXTENDED_SESSION_MAX_AGE : SESSION_MAX_AGE)
  );

  return {
    id: sessionId,
    userId,
    token: generateSessionToken(),
    expiresAt,
    twoFactorVerified: options.twoFactorVerified || false,
    ipAddress: '', // Will be set by middleware
    userAgent: '', // Will be set by middleware
    createdAt: new Date()
  };
}

/**
 * Creates secure HTTP-only session cookie
 */
export function createSessionCookie(session: AuthSession, rememberMe = false): string {
  const maxAge = rememberMe ? EXTENDED_SESSION_MAX_AGE : SESSION_MAX_AGE;
  const cookieOptions = [
    `${SESSION_COOKIE_NAME}=${session.token}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    `Max-Age=${Math.floor(maxAge / 1000)}`
  ];

  return cookieOptions.join('; ');
}

/**
 * Creates 2FA verification cookie
 */
export function createTwoFactorCookie(token: string): string {
  return [
    `${TWO_FACTOR_COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Max-Age=600' // 10 minutes
  ].join('; ');
}

/**
 * Validates session cookie
 */
export function validateSessionCookie(cookieValue: string): boolean {
  try {
    const [token, ...options] = cookieValue.split(';').map(part => part.trim());
    const tokenValue = token.split('=')[1];

    if (!tokenValue || tokenValue.length !== 64) {
      return false;
    }

    // Additional validation could be done here with database lookup
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts client information from request
 */
export function extractClientInfo(request: NextRequest): {
  ipAddress: string;
  userAgent: string;
} {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

  const userAgent = request.headers.get('user-agent') || 'unknown';

  return { ipAddress, userAgent };
}

/**
 * Generates security questions for account recovery
 */
export function generateSecurityQuestions(): Array<{
  id: string;
  question: string;
}> {
  const questions = [
    'What was the name of your first pet?',
    'What was the make and model of your first car?',
    'In what city were you born?',
    'What was your childhood nickname?',
    'What is your mother\'s maiden name?',
    'What was the name of your elementary school?',
    'What is your favourite childhood book?',
    'What was the name of the street you grew up on?',
    'What was your first job title?',
    'What is the name of your favourite teacher?'
  ];

  // Randomly select 3 questions
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map((question, index) => ({
    id: `q${index + 1}`,
    question
  }));
}

/**
 * Sets up two-factor authentication
 */
export function setupTwoFactor(user: User): TwoFactorSetup {
  // In a real implementation, you would use a library like speakeasy
  // For now, we'll simulate the setup
  const secret = crypto.randomBytes(32).toString('base64');
  const qrCode = `otpauth://totp/ClientPortal:${user.email}?secret=${secret}&issuer=ClientPortal`;

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );

  return {
    secret,
    qrCode,
    backupCodes
  };
}

/**
 * Validates two-factor authentication code
 */
export function validateTwoFactorCode(secret: string, code: string): boolean {
  // In a real implementation, you would use a library like speakeasy
  // For now, we'll simulate validation
  // This is a placeholder - replace with actual TOTP validation
  return code.length === 6 && /^\d{6}$/.test(code);
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Sanitises user input to prevent XSS
 */
export function sanitiseInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Rate limiting for login attempts
 */
const loginAttempts = new Map<string, { count: number; lastAttempt: Date; blockedUntil?: Date }>();

export function checkLoginRateLimit(ipAddress: string): {
  allowed: boolean;
  waitTime?: number;
} {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  const blockDuration = 30 * 60 * 1000; // 30 minutes

  const attempts = loginAttempts.get(ipAddress);

  if (!attempts) {
    loginAttempts.set(ipAddress, { count: 1, lastAttempt: new Date(now) });
    return { allowed: true };
  }

  // Reset if outside window
  if (now - attempts.lastAttempt.getTime() > windowMs) {
    loginAttempts.set(ipAddress, { count: 1, lastAttempt: new Date(now) });
    return { allowed: true };
  }

  // Check if currently blocked
  if (attempts.blockedUntil && now < attempts.blockedUntil.getTime()) {
    const waitTime = Math.ceil((attempts.blockedUntil.getTime() - now) / 1000);
    return { allowed: false, waitTime };
  }

  // Increment attempts
  attempts.count++;
  attempts.lastAttempt = new Date(now);

  if (attempts.count >= maxAttempts) {
    attempts.blockedUntil = new Date(now + blockDuration);
    const waitTime = Math.ceil(blockDuration / 1000);
    return { allowed: false, waitTime };
  }

  loginAttempts.set(ipAddress, attempts);
  return { allowed: true };
}

/**
 * Clears rate limit for successful login
 */
export function clearLoginRateLimit(ipAddress: string): void {
  loginAttempts.delete(ipAddress);
}

/**
 * Validates CSRF token
 */
export function validateCsrfToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false;

  // In a real implementation, you would store CSRF tokens in the session
  // and validate them here
  return token.length === 32 && /^[a-f0-9]+$/.test(token);
}

/**
 * Generates a CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Checks if session is expired
 */
export function isSessionExpired(session: AuthSession): boolean {
  return new Date() > session.expiresAt;
}

/**
 * Extends session expiry
 */
export function extendSession(session: AuthSession, rememberMe = false): AuthSession {
  const newExpiresAt = new Date(
    Date.now() + (rememberMe ? EXTENDED_SESSION_MAX_AGE : SESSION_MAX_AGE)
  );

  return {
    ...session,
    expiresAt: newExpiresAt
  };
}

/**
 * Validates user permissions for resource access
 */
export function validateResourceAccess(
  user: User,
  resourceOwnerId: string,
  requiredPermission?: string
): boolean {
  // Users can only access their own resources
  return user.id === resourceOwnerId;
}

/**
 * Logs security events
 */
export function logSecurityEvent(
  type: 'login_attempt' | 'login_success' | 'login_failure' | 'password_reset' | '2fa_setup',
  userId?: string,
  ipAddress?: string,
  details?: string
): void {
  // In a real implementation, this would write to a security log
  console.log(`Security Event: ${type}`, {
    userId,
    ipAddress,
    details,
    timestamp: new Date().toISOString()
  });
}