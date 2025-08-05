import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for admin routes (excluding login page)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = getTokenFromRequest(request);

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify the token
    const payload = await verifyToken(token);
    if (!payload) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
