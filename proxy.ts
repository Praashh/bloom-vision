import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET as string,
        salt: process.env.NEXTAUTH_SALT as string,
        secureCookie: req.nextUrl.protocol === 'https:',
    });

    const isAuthRoute = pathname === '/signin';
    const isProtectedRoute = pathname.startsWith('/history') || pathname.startsWith('/api/generate') || pathname.startsWith("/api/images") || pathname;

    if (isAuthRoute) {
        if (token) {
            return NextResponse.redirect(new URL('/history', req.url));
        }
        return NextResponse.next();
    }

    if (isProtectedRoute) {
        if (!token) {
            const signinUrl = new URL('/signin', req.url);
            signinUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(signinUrl);
        }

        const now = Date.now() / 1000;
        if (token.exp && now > token.exp) {
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }

    return NextResponse.next();
}

export const config = { matcher: ['/history', '/api/generate', '/api/images', '/signin', "/"] };