import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          user: null,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone || '',
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        user: null,
        error: error?.message,
      },
      { headers: NO_CACHE_HEADERS }
    );
  }
}
