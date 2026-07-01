import { NextResponse } from 'next/server';
import { UserService } from '@/app/services/users/user.services';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: "Missing token." }, { status: 400 });
  }

  try {
    await UserService.verifyUser({ token });
    
    return NextResponse.json({ message: "Email successfully verified!" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}