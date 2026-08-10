import { NextResponse } from 'next/server';
import { UserService } from '@/app/services/users/user.services';
import { setEncryptedUserCookie } from '@/lib/hooks/api/authCookies';
import { ERROR_CODES } from '@/lib/constants';

// POST /api/auth/login - Authenticate credentials
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userSession = await UserService.login(body);

    await setEncryptedUserCookie(userSession);

    return NextResponse.json({ status: 'success', message: 'Successfully logged in' });
    
  } catch (error: any) {
    const errorMessage = error.message || '';

    if (errorMessage.includes(ERROR_CODES.VALIDATION_ERROR)) {
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 400 });
    }

    if (errorMessage.includes(ERROR_CODES.AUTH_ERROR)) {
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 401 });
    }

    return NextResponse.json(
      { status: 'error', message: 'An internal authentication fault occurred.' },
      { status: 500 }
    );
  }
}