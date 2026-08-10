// app/api/auth/verifyEmail/route.ts
import { NextResponse } from "next/server";
import { UserService } from "@/app/services/users/user.services";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/verify-email?status=error&message=Missing+token`);
  }

  try {
    await UserService.verifyUser({ token });
    
    return NextResponse.redirect(`${baseUrl}/verify-email?status=success`);
  } catch (error: any) {
    return NextResponse.redirect(
      `${baseUrl}/verify-email?status=error&message=${encodeURIComponent(error.message)}`
    );
  }
}