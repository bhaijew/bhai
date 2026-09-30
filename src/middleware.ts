import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin route at the Edge
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('bhai_auth_session')?.value;
    let isAuthenticatedAdmin = false;

    if (sessionCookie) {
      try {
        const parts = sessionCookie.split('.');
        if (parts.length === 2) {
          const [dataBase64] = parts;
          const base64 = dataBase64.replace(/-/g, '+').replace(/_/g, '/');
          const json = atob(base64);
          const user = JSON.parse(json);

          if (user && user.role === 'admin' && (!user.exp || Date.now() <= user.exp)) {
            isAuthenticatedAdmin = true;
          }
        }
      } catch {
        isAuthenticatedAdmin = false;
      }
    }

    // If user is accessing /admin/login:
    if (pathname === '/admin/login') {
      // If already logged in as admin, send directly to /admin dashboard
      if (isAuthenticatedAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // For all protected /admin routes:
    if (!isAuthenticatedAdmin) {
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
