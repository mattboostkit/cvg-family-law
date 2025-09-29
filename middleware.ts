import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, detectLocale, getLocaleFromPath, addLocaleToPath, SupportedLocale } from '@/lib/i18n';

const PUBLIC_FILE = /\.(.*)$/;

// Get the preferred locale for the request
function getPreferredLocale(request: NextRequest): SupportedLocale {
  // Check if locale is already in pathname
  const pathname = request.nextUrl.pathname;
  const existingLocale = getLocaleFromPath(pathname);

  if (existingLocale && locales.includes(existingLocale)) {
    return existingLocale;
  }

  // Detect from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  return detectLocale(acceptLanguage);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for public files
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip middleware for Next.js internal routes
  if (pathname.startsWith('/_next/') || pathname.startsWith('/studio/')) {
    return NextResponse.next();
  }

  const preferredLocale = getPreferredLocale(request);

  // If the pathname doesn't start with a locale and it's not the root path
  if (!getLocaleFromPath(pathname) && pathname !== '/') {
    // Add locale prefix to pathname
    const newPathname = addLocaleToPath(pathname, preferredLocale);
    const response = NextResponse.redirect(
      new URL(newPathname, request.url)
    );

    // Set locale cookie for future requests
    response.cookies.set('locale', preferredLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  }

  // If accessing root path, redirect to preferred locale
  if (pathname === '/') {
    const newPathname = addLocaleToPath('/', preferredLocale);
    const response = NextResponse.redirect(
      new URL(newPathname, request.url)
    );

    // Set locale cookie for future requests
    response.cookies.set('locale', preferredLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  }

  // Add locale to response cookies if not already present
  const response = NextResponse.next();
  if (!response.cookies.get('locale')) {
    response.cookies.set('locale', preferredLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};