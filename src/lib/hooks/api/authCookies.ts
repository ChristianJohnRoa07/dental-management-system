import { cookies } from "next/headers";
import { encryptObject, decryptObject } from "@/lib/hooks/ui/encrpytDecrypt";

const USER_COOKIE_NAME = "encrypted_user";
// 8 hours in seconds (8 * 60 * 60 = 28,800 seconds)
const EIGHT_HOURS_IN_SECONDS = 8 * 60 * 60;

/**
 * Encrypts user data and sets it in an HTTP-only secure cookie.
 * (Call this in Next.js Server Actions, Route Handlers, or SSR context)
 */
export async function setEncryptedUserCookie<T>(userData: T): Promise<void> {
  const encryptedData = encryptObject(userData);

  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE_NAME, encryptedData, {
    httpOnly: true, // Prevents client-side JS access (XSS protection)
    secure: process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS
    sameSite: "lax", // CSRF protection
    maxAge: EIGHT_HOURS_IN_SECONDS,
    path: "/",
  });
}

/**
 * Retrieves and decrypts user data from the HTTP-only cookie.
 */
export async function getEncryptedUserCookie<T>(): Promise<T | null> {
  try {
    const cookieStore = await cookies();
    const encryptedCookie = cookieStore.get(USER_COOKIE_NAME);

    if (!encryptedCookie?.value) {
      return null;
    }

    return decryptObject<T>(encryptedCookie.value);
  } catch (error) {
    console.error("Failed to decrypt user cookie:", error);
    return null;
  }
}

/**
 * Deletes the user cookie upon logout.
 */
export async function removeEncryptedUserCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE_NAME);
}