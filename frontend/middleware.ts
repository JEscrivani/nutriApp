import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token");
    var validToken = token != null;
    var userData = null;
    
    if (validToken) {
        const response = await fetch("http://localhost:8000/auth/validate", {
            method: "GET",
            headers: {Cookie: `token=${token?.value}`}
        });
        validToken = response.ok;
        if (validToken) userData = await response.json();
    }
    const { pathname } = request.nextUrl;

    switch (pathname) {
        case "/login":
            if (validToken) {
                return NextResponse.redirect(new URL("/menu", request.url))
            }
            return NextResponse.next();
        case "/menu":
            if (!validToken) {
                return NextResponse.redirect(new URL("/login", request.url))
            }
            if (userData!.role === "nutricionista") {
                return NextResponse.redirect(new URL("/menu/dietitians", request.url))
            } else {
                return NextResponse.redirect(new URL("/menu/client", request.url))
            }
        case "/menu/dietitians":
        case "/client/new":
            if (!validToken) {
                return NextResponse.redirect(new URL("/login", request.url))
            }
            if (userData!.role != "nutricionista") {
                return NextResponse.redirect(new URL("/menu/client", request.url))
            }
            return NextResponse.next();
        case "/menu/client":
            if (!validToken) {
                return NextResponse.redirect(new URL("/login", request.url))
            }
            if (userData!.role === "nutricionista") {
                return NextResponse.redirect(new URL("/menu/dietitians", request.url))
            }
            return NextResponse.next();
        default:
            return NextResponse.next();
    }

}

export const config = {
    matcher: ["/login", "/menu/:path*", "/client/new"]
}