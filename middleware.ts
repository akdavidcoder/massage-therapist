import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle CORS preflight for API routes so browser OPTIONS won't fall through to /404
  if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    const res = NextResponse.json(null, { status: 204 });
    res.headers.set('Access-Control-Allow-Origin', '*'); // adjust origin in prod if needed
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.headers.set('Access-Control-Max-Age', '86400');
    return res;
  }

  // For admin API routes, log auth-related headers for debugging (temporary)
  if (pathname.startsWith('/api/admin')) {
    try {
      // Note: console.error in middleware will show up in Vercel logs for the request
      console.error('DEBUG middleware - incoming admin request:', {
        method: req.method,
        url: req.url,
        cookie: req.headers.get('cookie'),
        authorization: req.headers.get('authorization'),
      });
    } catch (e) {
      console.error('DEBUG middleware - logging failed:', String(e));
    }
  }

  // Let all other requests proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};