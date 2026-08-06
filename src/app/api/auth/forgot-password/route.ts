import { NextResponse } from "next/server";
import { UserService } from "@/app/services/users/user.services"; // Adjust import path
import { success } from "zod";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const origin = request.headers.get("origin") || undefined;

    await UserService.forgotPasswordEmailSend({ email, origin });

    return NextResponse.json(
      { 
        success: true,
        message: "If an account exists, a reset link has been sent." 
      },
      { status: 200 }
    );
  } catch (err: any) {
    if (err.message === "Email is required.") {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }

    console.error("Forgot password service error:", err);
    return NextResponse.json(
      { message: "Internal server error"+ err },
      { status: 500 }
    );
  }
}