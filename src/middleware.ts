import { NextResponse } from 'next/server';
import db from "@/lib/db";
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/procedures')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: ERROR_CODES.TOKEN_NOT_FOUND, message: ERROR_MESSAGES.TOKEN_NOT_FOUND },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = process.env.JWT_SECRET;

      const encodedSecret = new TextEncoder().encode(secret);

      const { payload } = await jwtVerify(token, encodedSecret);

      // const isBlacklisted = await db.tokenBlacklist.findUnique({
      //   where: { token: token },
      // });

      // if (isBlacklisted) {
      //   return NextResponse.json(
      //     { status: ERROR_CODES.INVALID_TOKEN, message: ERROR_MESSAGES.INVALID_TOKEN },
      //     { status: 401 }
      //   );
      // }

      const userId = (payload.id) as string;
      const userRole = (payload.role) as string;

      if (!userId) {
        return NextResponse.json({
          status: ERROR_CODES.INVALID_TOKEN,
          message: ERROR_MESSAGES.INVALID_TOKEN,
          debugTokenPayloadContent: payload
        }, { status: 401 });
      }

      if (request.method !== 'GET' && userRole !== 'ADMIN') {
        return NextResponse.json(
          { status: ERROR_CODES.FORBIDDEN_ERROR, message: ERROR_MESSAGES.FORBIDDEN_ERROR },
          { status: 403 }
        );
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
        { status: ERROR_CODES.INVALID_TOKEN, message: `${error.message}` },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/procedures',
    '/api/procedures/:path*'
  ],
};