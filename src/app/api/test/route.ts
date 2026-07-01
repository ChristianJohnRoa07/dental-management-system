import { NextResponse } from "next/server";

// This function handles incoming GET requests to /api/test
export async function GET() {
  const data = {
    message: "Hello from the Next.js Docker Backend! CJ",
    timestamp: new Date().toISOString(),
    status: "healthy",
  };

  return NextResponse.json(data);
}