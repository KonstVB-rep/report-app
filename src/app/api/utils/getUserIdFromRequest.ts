"use server"

import { jwtVerify } from "jose"
import { cookies } from "next/headers"

interface DecodedToken {
  userId: string
}

export async function getUserIdFromRequest(): Promise<string | null> {
  const cookieStore = await cookies()

  const cookie = cookieStore.get("accessToken") //

  if (!cookie || !cookie.value) {
    return null
  }

  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY) // Кодируем ключ в нужный формат
    const { payload } = await jwtVerify(cookie.value, secretKey) // Проверка и декодирование токена

    const decodedPayload = payload as unknown

    if (
      typeof decodedPayload === "object" &&
      decodedPayload !== null &&
      "userId" in decodedPayload
    ) {
      const decodedToken = decodedPayload as DecodedToken
      return decodedToken.userId
    }

    console.error("Токен не содержит userId")
    return null
  } catch (error) {
    console.error("Ошибка при декодировании токена", error)
    return null
  }
}
