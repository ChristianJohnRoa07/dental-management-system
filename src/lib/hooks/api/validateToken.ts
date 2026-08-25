import { jwtVerify } from "jose";
import db from "@/lib/db";
import { CustomJwtPayload } from "@/interface/user/JWTPayload";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET environment variable is missing.");
}

const JWT_SECRET = new TextEncoder().encode(secretKey);

async function isTokenBlacklisted(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const blacklisted = await db.tokenBlacklist.findUnique({
      where: { token },
    });
    return !!blacklisted;
  } catch (error) {
    return false;
  }
}

export async function validateToken(
  token: string
): Promise<CustomJwtPayload | null> {
  if (!token) return null;

  try {
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as CustomJwtPayload;
  } catch (error: any) {
    return null;
  }
}