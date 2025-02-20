import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the password from the URL (e.g., /admin?password=your-password)
    const password = request.nextUrl.searchParams.get('password');
    
    // Check if password is correct (you should use environment variable in production)
    if (password !== 'hadassa-oscar-2024') {
      // Redirect to home page if password is incorrect
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Get the response
  const response = NextResponse.next();

  // Add security headers
  const headers = response.headers;

  // CORS
  headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || 'http://localhost:3000');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Security headers
  headers.set('X-DNS-Prefetch-Control', 'on');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'origin-when-cross-origin');
  headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  return response;
}

// Run middleware on API routes and admin pages
export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/admin'],
}; 