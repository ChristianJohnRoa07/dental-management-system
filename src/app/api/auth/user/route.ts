import { NextResponse } from "next/server";
import { getEncryptedUserCookie } from "@/lib/hooks/api/authCookies";
import { UserSession } from "@/interface/user/userInSession";

export async function GET() {
  try {
    const user = (await getEncryptedUserCookie()) as UserSession | null;

    if (!user) {
      return NextResponse.json({
        status: "success",
        data: null,
        message: "No active session",
      });
    }

    const sanitizedUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified
    };

    return NextResponse.json({
      status: "success",
      data: sanitizedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch user session" },
      { status: 500 },
    );
  }
}
