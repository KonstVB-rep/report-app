import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyToken } from "@/shared/lib/helpers/checkTokens"

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  try {
    if (!accessToken) throw new Error("No token")

    const payload = await verifyToken(accessToken)

    return NextResponse.json({ isValid: true, payload })
  } catch (error) {
    console.error("Ошибка валидации токена:", error)
    return NextResponse.json({
      isValid: false,
      error: (error as Error).message,
    })
  }
}
