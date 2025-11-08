import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const guestOnlyRoutes = ['/auth/signin', '/auth/signup'];
const userOnlyRoutes = ['/profile', '/funnel', '/diagram', '/ontology', '/kanban'];
const adminOnlyRoutes = ['/admin'];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const url = req.nextUrl;

    const isAuth = !!token?.userId;
    const isAdmin = token?.role !== undefined && (token?.role as string) === 'admin';

    const pathname = url.pathname;

    // 1. Защита гостевых маршрутов от авторизованных пользователей
    if (isAuth && guestOnlyRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/profile', url));
    }

    // 2. Защита user-only маршрутов от гостей
    if (!isAuth && userOnlyRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth/signin', url));
    }

    // 3. Защита admin-only маршрутов
    if (!isAdmin && adminOnlyRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/profile', url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

// Расширенный matcher для всех защищаемых маршрутов
export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/funnel/:path*',
    '/diagram/:path*',
    '/ontology/:path*',
    '/kanban/:path*',
  ],
};