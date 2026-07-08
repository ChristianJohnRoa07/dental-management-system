import { NextResponse } from 'next/server';
import { UserService } from '@/app/services/users/user.services';

// GET /api/user - Fetch all users
export async function GET() {
  try {
    const users = await UserService.getAll();
    return NextResponse.json({ status: 'success', data: users });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
