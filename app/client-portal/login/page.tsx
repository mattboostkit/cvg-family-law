'use client';

// Secure Login Page for Client Portal
// Implements 2FA, password strength validation, and security features

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  LoginCredentials,
  ApiResponse,
  SecurityQuestion
} from '@/types/client-portal';
import {
  validatePasswordStrength,
  validateEmail,
  sanitiseInput,
  checkLoginRateLimit,
  logSecurityEvent
} from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'login' | '2fa' | 'security-questions'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [securityAnswers, setSecurityAnswers] = useState<Record<string, string>>({});

  // Password strength
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const passwordStrength = validatePasswordStrength(credentials.password);

  // Rate limiting state
  const [rateLimitWait, setRateLimitWait] = useState<number | null>(null);

  // Check for redirect URL
  const redirectTo = searchParams.get('redirect') || '/client-portal/dashboard';

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include'
      });
      if (response.ok) {
        router.push('/client-portal/dashboard');
      }
    } catch (error) {
      // User not authenticated, continue with login
    }
  };

  const handleEmailChange = (email: string) => {
    const sanitised = sanitiseInput(email.toLowerCase());
    if (sanitised !== email) {
      setError('Email contains invalid characters');
      return;
    }

    setCredentials(prev => ({ ...prev, email: sanitised }));
    setError('');
  };

  const handlePasswordChange = (password: string) => {
    setCredentials(prev => ({ ...prev, password }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate email
      if (!validateEmail(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password
      if (!credentials.password) {
        throw new Error('Please enter your password');
      }

      // Check rate limiting
      const clientIP = await getClientIP();
      const rateLimitCheck = checkLoginRateLimit(clientIP);

      if (!rateLimitCheck.allowed) {
        setRateLimitWait(rateLimitCheck.waitTime || 1800);
        throw new Error(`Too many login attempts. Please try again in ${Math.ceil((rateLimitCheck.waitTime || 1800) / 60)} minutes`);
      }

      // Log login attempt
      logSecurityEvent('login_attempt', undefined, clientIP, `Login attempt for ${credentials.email}`);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe
        })
      });

      const result: ApiResponse<{ requires2FA: boolean; requiresSecurityQuestions: boolean }> = await response.json();

      if (!response.ok) {
        logSecurityEvent('login_failure', undefined, clientIP, result.error);
        throw new Error(result.error || 'Login failed');
      }

      if (result.data?.requires2FA) {
        setStep('2fa');
        return;
      }

      if (result.data?.requiresSecurityQuestions) {
        setStep('security-questions');
        return;
      }

      // Successful login
      logSecurityEvent('login_success', undefined, clientIP, 'Successful login');
      router.push(redirectTo);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!twoFactorCode || twoFactorCode.length !== 6) {
        throw new Error('Please enter a valid 6-digit code');
      }

      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code: twoFactorCode })
      });

      const result: ApiResponse<User> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Two-factor authentication failed');
      }

      router.push(redirectTo);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/security-questions/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ answers: securityAnswers })
      });

      const result: ApiResponse<User> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Security question verification failed');
      }

      router.push(redirectTo);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('/api/auth/ip');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score >= 4) return 'text-green-600';
    if (passwordStrength.score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score >= 4) return 'Strong';
    if (passwordStrength.score >= 3) return 'Medium';
    if (passwordStrength.score >= 2) return 'Weak';
    return 'Very Weak';
  };

  if (rateLimitWait) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Too Many Attempts
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait {Math.ceil(rateLimitWait / 60)} minutes before trying again.
            </p>
            <button
              onClick={() => setRateLimitWait(null)}
              className="mt-4 text-blue-600 hover:text-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Client Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure access to your case information
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {step === 'login' && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={credentials.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onFocus={() => setShowPasswordStrength(true)}
                  onBlur={() => setShowPasswordStrength(false)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {showPasswordStrength && credentials.password && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Password Strength:</span>
                  <span className={getPasswordStrengthColor()}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score >= 4 ? 'bg-green-600' :
                      passwordStrength.score >= 3 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                {passwordStrength.errors.length > 0 && (
                  <ul className="text-sm text-red-600 space-y-1">
                    {passwordStrength.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={credentials.rememberMe}
                  onChange={(e) => setCredentials(prev => ({ ...prev, rememberMe: e.target.checked }))}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => router.push('/client-portal/forgot-password')}
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !credentials.email || !credentials.password}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        )}

        {step === '2fa' && (
          <form className="mt-8 space-y-6" onSubmit={handleTwoFactorAuth}>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Two-Factor Authentication
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                placeholder="000000"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || twoFactorCode.length !== 6}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500"
                onClick={() => setStep('login')}
              >
                Back to login
              </button>
            </div>
          </form>
        )}

        {step === 'security-questions' && (
          <form className="mt-8 space-y-6" onSubmit={handleSecurityQuestions}>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Security Questions
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Please answer your security questions
              </p>
            </div>

            {/* Security questions would be loaded from API */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  What was the name of your first pet?
                </label>
                <input
                  type="text"
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={securityAnswers.q1 || ''}
                  onChange={(e) => setSecurityAnswers(prev => ({ ...prev, q1: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}