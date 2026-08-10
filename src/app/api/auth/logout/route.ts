import { NextResponse } from 'next/server';
import { UserService } from '@/app/services/users/user.services'; 
import { removeEncryptedUserCookie } from '@/lib/hooks/api/authCookies';

export async function POST(request: Request) {
  try {
    await removeEncryptedUserCookie();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ status: 'error', message: 'Missing token' }, { status: 400 });
    }

    const token = authHeader.split(' ')[1];
    
    const result = await UserService.logout({ token });
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}