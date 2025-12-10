import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./shared/lib/helpers/checkTokens"
import { fetchWithTimeout } from "./shared/lib/helpers/fetchWithTimeout"

async function redirectToLogin(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)
  const response = NextResponse.redirect(loginUrl)

  response.cookies.delete("accessToken")
  response.cookies.delete("refreshToken")

  return response
}

const refreshTokenRequest = async (refreshToken: string) => {
  const res = await fetchWithTimeout("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })

  return res.json()
}

async function refreshTokens(request: NextRequest, refreshToken: string) {
  try {
    if (request.headers.has("next-action")) {
      return NextResponse.next()
    }
    const tokens = await refreshTokenRequest(refreshToken)

    if (!tokens.accessToken) {
      throw new Error("Новый токен доступа не получен")
    }

    const response = NextResponse.next()

    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    if (tokens.refreshToken) {
      response.cookies.set("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      })
    }

    return response
  } catch (err) {
    console.error("refreshTokens error:", err)
    return null
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next()
  }

  if (request.method === "POST" && pathname === "/login") {
    return NextResponse.next()
  }

  if (pathname === "/login" || pathname === "/") {
    if (accessToken) {
      try {
        await verifyToken(accessToken)
        return NextResponse.redirect(new URL("/dashboard", request.url))
      } catch (_err) {
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  if (!accessToken && !refreshToken) {
    return redirectToLogin(request)
  }

  if (accessToken) {
    try {
      await verifyToken(accessToken)
      return NextResponse.next()
    } catch (error) {
      console.log("Токен доступа недействителен", error)
    }
  }

  if (refreshToken) {
    const response = await refreshTokens(request, refreshToken)
    if (response) {
      return response
    }
  }

  return redirectToLogin(request)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/login",
    "/dashboard/:path*",
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
