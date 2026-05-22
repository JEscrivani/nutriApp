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
                return NextResponse.redirect(new URL("/menu/nutricionista", request.url))
            } else {
                return NextResponse.redirect(new URL("/menu/cliente", request.url))
            }
        case "/menu/nutricionista":
            if (!validToken) {
                return NextResponse.redirect(new URL("/login", request.url))
            }
            if (userData!.role != "nutricionista") {
                return NextResponse.redirect(new URL("/menu/cliente", request.url))
            }
            return NextResponse.next();
        case "/menu/cliente":
            if (!validToken) {
                return NextResponse.redirect(new URL("/login", request.url))
            }
            if (userData!.role === "nutricionista") {
                return NextResponse.redirect(new URL("/menu/nutricionista", request.url))
            }
            return NextResponse.next();
        default:
            return NextResponse.next();
    }

}

export const config = {
    matcher: ["/login", "/menu/:path*"]
}