import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ERROR_CODES, ERROR_MESSAGES, USER_COOKIE_NAME } from "@/lib/constants";
import { API_PROTECTED_ROUTES, API_RECOGNIZED_ROUTES } from "@/lib/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const isRecognizedRoute = API_RECOGNIZED_ROUTES.test(pathname);

    if (!isRecognizedRoute) {
      return NextResponse.json(
        {
          status: ERROR_CODES.RESOURCE_NOT_FOUND,
          message: ERROR_MESSAGES.RESOURCE_NOT_FOUND,
        },
        { status: 404 }
      );
    }
  }

  if (API_PROTECTED_ROUTES.test(pathname)) {
    const rawCookie = request.cookies.get(USER_COOKIE_NAME)?.value;

    if (!rawCookie) {
      return NextResponse.json(
        {
          status: ERROR_CODES.TOKEN_NOT_FOUND,
          message: ERROR_MESSAGES.TOKEN_NOT_FOUND,
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};