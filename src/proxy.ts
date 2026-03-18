import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./shared/lib/auth/session"

function redirectToLogin(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)
  const response = NextResponse.redirect(loginUrl)

  response.cookies.set("accessToken", "", { path: "/", maxAge: 0 })
  response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 })

  return response
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  if (pathname.startsWith("/adminboard")) {
    const tokenToVerify = accessToken || refreshToken

    if (!tokenToVerify) return redirectToLogin(request)

    const user = await verifyToken(tokenToVerify, accessToken ? "access" : "refresh")

    if (!user || user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next()
  }

  if (pathname === "/login" || pathname === "/") {
    if (accessToken) {
      const user = await verifyToken(accessToken, "access")
      if (user) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
    return NextResponse.next()
  }

  const tokenToVerify = accessToken || refreshToken

  if (!tokenToVerify) {
    return redirectToLogin(request)
  }
  const finalUser = await verifyToken(tokenToVerify, accessToken ? "access" : "refresh")

  if (!finalUser) {
    return redirectToLogin(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/login",
    "/dashboard/:path*",
    "/adminboard/:path*",
    "/table/:path*",
    "/profile/:path*",
    "/summary-table/:path*",
    "/deal/:path*",
    "/statistics/:path*",
    "/calendar/:path*",
    "/tasks/:path*",
    "/orders/:path*",
    "/",
  ],
}
