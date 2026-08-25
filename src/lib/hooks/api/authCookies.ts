import { cookies } from "next/headers";
import { encryptObject, decryptObject } from "@/lib/hooks/ui/encrpytDecrypt";
import { SESSION_DURATION_SECONDS, USER_COOKIE_NAME } from "@/lib/constants";
import { UserSession } from "@/interface/user/userInSession";

/**
 * Encrypts user data and sets it in an HTTP-only secure cookie.
 * (Call this in Next.js Server Actions, Route Handlers, or SSR context)
 */
export async function setEncryptedUserCookie(userSession: any): Promise<void> {
  const cookieStore = await cookies();
  const encryptedData = encryptObject(userSession);

  cookieStore.set(USER_COOKIE_NAME, encryptedData, {
    httpOnly: true, // Prevents client-side JS access (XSS protection)
    secure: process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS
    sameSite: "strict", // CSRF protection
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

/**
 * Retrieves and decrypts user data from the HTTP-only cookie.
 */
export async function getEncryptedUserCookie(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const encryptedCookie = cookieStore.get(USER_COOKIE_NAME)?.value;

    if (!encryptedCookie) {
      return null;
    }

    return decryptObject(encryptedCookie);
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