import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const pathname = request.nextUrl.pathname

  // ✅ Redirect unauthenticated users away from /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
 
    

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  // ✅ Redirect authenticated users away from /signin and /signup
  if ((pathname === "/auth/signin" || pathname === "/auth/signup") && token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      // invalid token, allow them to visit signin/signup
    }
  }
  //will implement later
  if (pathname.startsWith("/domains")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/auth/signup","/auth/signin"],
}
