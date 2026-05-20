import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    const isLoginPage = pathname === "/login";

    if (isLoginPage && token) {
        return NextResponse.redirect(new URL("/menu", request.url))
    }

    if (!isLoginPage && !token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/menu/:path*"]
}