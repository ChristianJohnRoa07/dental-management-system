import { NextResponse } from "next/server";
import { validateToken } from "./validateToken";
import { CustomJwtPayload } from "@/interface/user/JWTPayload";
import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/constants";
import { getEncryptedUserCookie } from "./authCookies";
import { Role } from "@/app/generated/prisma/enums";

type AuthenticatedHandler = (
  req: Request,
  user: CustomJwtPayload
) => Promise<NextResponse>;

export function checkSession(
  handler: AuthenticatedHandler,
  options?: { requiredRoles?: Role[] }
) {
  return async (req: Request) => {
    try {
      const userSession = await getEncryptedUserCookie();

      if (!userSession || !userSession.accessToken) {
        return NextResponse.json(
          { status: ERROR_CODES.TOKEN_NOT_FOUND, message: ERROR_MESSAGES.TOKEN_NOT_FOUND },
          { status: 401 }
        );
      }

      const payload = await validateToken(userSession.accessToken);

      if (!payload || !payload.id) {
        return NextResponse.json(
          { status: ERROR_CODES.INVALID_TOKEN, message: ERROR_MESSAGES.INVALID_TOKEN },
          { status: 401 }
        );
      }

      // Role-Based Access Control (RBAC) Check
      if (options?.requiredRoles && !options.requiredRoles.includes(payload.role as Role)) {
        return NextResponse.json(
          { status: ERROR_CODES.FORBIDDEN_ERROR, message: ERROR_MESSAGES.FORBIDDEN_ERROR },
          { status: 403 }
        );
      }

      return await handler(req, payload);
    } catch (error: any) {
      return NextResponse.json(
        { status: "error", message: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  };
}