import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('algrace_session');

  console.log(`🛡️ [Proxy] Intercepting: ${pathname} | Session: ${!!session}`);

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  
  const isProtectedRoute = 
    pathname === '/' || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/history');

  if (isProtectedRoute && !session) {
    console.log("🚫 Access denied to root/protected route. Redirecting to /login");
    const loginUrl = new URL('/login', request.url);
    
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }

 
  if ((isAuthRoute || pathname === '/') && session) {
    console.log("✅ Session active. Redirecting to /dashboard");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};