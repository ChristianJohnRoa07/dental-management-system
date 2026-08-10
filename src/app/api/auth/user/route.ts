import { NextResponse } from "next/server";
import { getEncryptedUserCookie } from "@/lib/hooks/api/authCookies";

export async function GET() {
  try {
    const user = await getEncryptedUserCookie();

    if (!user) {
      return NextResponse.json({
        status: "success",
        data: null,
        message: "No active session",
      });
    }

    return NextResponse.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch user session" },
      { status: 500 },
    );
  }
}
