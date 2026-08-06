import { NextResponse } from "next/server";
import { UserService } from "@/app/services/users/user.services";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    const result = await UserService.resetPassword({ token, newPassword });

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    const validationErrors = [
      "Token and new password are required.",
      "Password must be at least 8 characters long.",
      "Invalid or expired password reset token.",
    ];

    if (validationErrors.includes(errorMessage)) {
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    console.error("Reset password service error:", err);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
