import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

interface User {
  username: string;
  password: string;
}

// Mock user database - in production, you'd hash these passwords
const users: User[] = [
  { username: 'massageadmin', password: 'melhot20' },
];

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export const authenticateUser = (username: string, password: string) => {
  return users.find(
    (user) => user.username === username && user.password === password
  );
};

export async function createToken(username: string) {
  return await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest) {
  return request.cookies.get('admin-token')?.value;
}

export function isAuthenticated(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  return !!token;
}

// Higher-order function to protect API routes
export function requireAdmin<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T) => {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Token is valid, proceed with the original handler
    return handler(request, ...args);
  };
}
