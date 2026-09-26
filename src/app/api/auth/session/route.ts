import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('bhai_auth_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        user: null,
      });
    }

    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({
      success: true,
      authenticated: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      authenticated: false,
      user: null,
    });
  }
}
