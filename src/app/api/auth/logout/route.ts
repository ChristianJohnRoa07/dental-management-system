import { NextResponse } from 'next/server';
import { UserService } from '@/app/services/users/user.services'; 
import { getEncryptedUserCookie, removeEncryptedUserCookie } from '@/lib/hooks/api/authCookies';

export async function POST() {
  try {
    const userSession = await getEncryptedUserCookie();

    if (userSession?.accessToken) {
      await UserService.logout({ accessToken: userSession.accessToken });
    }

    await removeEncryptedUserCookie();

    return NextResponse.json(
      { status: "success", message: "Logged out successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    await removeEncryptedUserCookie();

    return NextResponse.json(
      { status: 'error', message: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}