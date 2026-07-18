import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants';
import { PROTECTED_ROUTES } from '@/lib/routes';

const encoder = new TextEncoder();
const encodedSecret = process.env.JWT_SECRET
  ? encoder.encode(process.env.JWT_SECRET)
  : null;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check API Resource
  if (pathname.startsWith('/api/')) {
    const isRecognizedRoute = PROTECTED_ROUTES.test(pathname);
    
    if (!isRecognizedRoute) {
      return NextResponse.json(
        { status: ERROR_CODES.RESOURCE_NOT_FOUND, message: ERROR_MESSAGES.RESOURCE_NOT_FOUND },
        { status: 404 }
      );
    }
  }

  // Check User authorization access rights
  if (PROTECTED_ROUTES.test(pathname)) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: ERROR_CODES.TOKEN_NOT_FOUND, message: ERROR_MESSAGES.TOKEN_NOT_FOUND },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    try {

      const { payload } = await jwtVerify(token, encodedSecret);

      const userId = (payload.id) as string;
      const userRole = (payload.role) as string;

      if (pathname.startsWith('/api/procedures')) {
        if (request.method !== 'GET' && userRole !== 'ADMIN') {
          return NextResponse.json(
            { status: ERROR_CODES.FORBIDDEN_ERROR, message: ERROR_MESSAGES.FORBIDDEN_ERROR },
            { status: 403 }
          );
        }
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', userId);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error: any) {
      return NextResponse.json(
        { status: ERROR_CODES.INVALID_TOKEN, message: `${ERROR_MESSAGES.INVALID_TOKEN}` },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*'
  ],
};