import { NextResponse } from 'next/server';
import { UserService } from '@/app/services/users/user.services';
import { ERROR_CODES } from '@/lib/constants';

// POST /api/user/register - Register a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = await UserService.register(body);
    
    return NextResponse.json({ status: 'success', data: newUser }, { status: 201 });
  } catch (error: any) {
    const errorMessage = error.message || '';

    // Map your custom service errors directly to standard HTTP Status Codes
    if (errorMessage.includes(ERROR_CODES.VALIDATION_ERROR)) {
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 400 });
    }
    
    if (errorMessage.includes(ERROR_CODES.CONFLICT_ERROR)) {
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 409 });
    }

    return NextResponse.json(
      { status: 'error', message: `${errorMessage}` },
      { status: 500 }
    );
  }
}