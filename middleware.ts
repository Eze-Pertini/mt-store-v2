import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (!url.pathname.startsWith('/admin')) return NextResponse.next();

  const isLogin = url.pathname === '/admin/login';
  const authed = req.cookies.get('admin_auth')?.value === 'ok';

  if (!authed && !isLogin) {
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  if (authed && isLogin) {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
