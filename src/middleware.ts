import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/constants";
import { API_PROTECTED_ROUTES, API_RECOGNIZED_ROUTES } from "@/lib/routes";

const encoder = new TextEncoder();
const encodedSecret = process.env.JWT_SECRET
    ? encoder.encode(process.env.JWT_SECRET)
    : null;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check API Resource
    if (pathname.startsWith("/api/")) {
        const isRecognizedRoute = API_RECOGNIZED_ROUTES.test(pathname);

        if (!isRecognizedRoute) {
            return NextResponse.json(
                {
                    status: ERROR_CODES.RESOURCE_NOT_FOUND,
                    message: ERROR_MESSAGES.RESOURCE_NOT_FOUND,
                },
                { status: 404 },
            );
        }
    }

    // Validate Authorization header ONLY for protected API routes
    if (API_PROTECTED_ROUTES.test(pathname)) {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                {
                    status: ERROR_CODES.TOKEN_NOT_FOUND,
                    message: ERROR_MESSAGES.TOKEN_NOT_FOUND,
                },
                { status: 401 },
            );
        }

        const token = authHeader.split(" ")[1];

        if (!encodedSecret) {
            console.error("JWT_SECRET is missing from environment variables.");
            return NextResponse.json(
                {
                    status: ERROR_CODES.INVALID_TOKEN,
                    message: "Internal server error",
                },
                { status: 500 },
            );
        }

        try {
            const { payload } = await jwtVerify(token, encodedSecret);

            const userId = payload.id as string;
            const userRole = payload.role as string;

            // Role-Based Access Control (RBAC) check for Procedures
            if (pathname.startsWith("/api/procedures")) {
                if (request.method !== "GET" && userRole !== "ADMIN") {
                    return NextResponse.json(
                        {
                            status: ERROR_CODES.FORBIDDEN_ERROR,
                            message: ERROR_MESSAGES.FORBIDDEN_ERROR,
                        },
                        { status: 403 },
                    );
                }
            }

            // Forward extracted payload user context to route handlers via custom request headers
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set("x-user-id", userId);
            requestHeaders.set("x-user-role", userRole);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (error: any) {
            return NextResponse.json(
                {
                    status: ERROR_CODES.INVALID_TOKEN,
                    message: ERROR_MESSAGES.INVALID_TOKEN,
                },
                { status: 401 },
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};
