import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
    const pathName = req.url;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET as string,
        salt: process.env.NEXTAUTH_SALT as string,
        secureCookie: req.nextUrl.protocol === "https",
    })

    const isAuthRoute = pathName === "/signin";
    const isProtectedRoute = pathName.startsWith("/dashboard");

    if (isAuthRoute) {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        return NextResponse.next();
    }

    if (isProtectedRoute) {
        if (!token) {
            const signinUrl = new URL('/signin', req.url);
            signinUrl.searchParams.set('callbackUrl', pathName);
            return NextResponse.redirect(signinUrl);
        }

        const now = Date.now() / 1000;
        if (token.exp && now > token.exp) {
            return NextResponse.redirect(new URL('/signin', req.url));
        }
    }

    return NextResponse.next();

}