import { NextResponse } from 'next/server';
import { UserService } from '@/app/services/users/user.services';
import { ERROR_CODES } from '@/lib/constants';

// POST /api/auth/login - Authenticate credentials
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userSession = await UserService.login(body);

    const response = NextResponse.json({ status: 'success', data: userSession });

    response.cookies.set({
      name: 'auth_token',
      value: userSession.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
    
  } catch (error: any) {
    const errorMessage = error.message || '';

    if (errorMessage.includes(ERROR_CODES.VALIDATION_ERROR)) {
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 400 });
    }

    if (errorMessage.includes(ERROR_CODES.AUTH_ERROR)) {
      // 401 Unauthorized prevents security leaks for bad passwords or usernames
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 401 });
    }

    return NextResponse.json(
      { status: 'error', message: 'An internal authentication fault occurred.' },
      { status: 500 }
    );
  }
}