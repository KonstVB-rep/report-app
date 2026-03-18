// "use server"

// import { errors, jwtVerify } from "jose"
// import { cookies } from "next/headers"
// import type { PayloadType } from "@/shared/lib/auth/session"

// export async function getUserFromCookie(): Promise<PayloadType | null> {
//   try {
//     const cookieStore = await cookies()
//     const token = cookieStore.get("accessToken")?.value

//     if (!token) return null

//     const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

//     const { payload } = await jwtVerify(token, secretKey)

//     return payload as unknown as PayloadType
//   } catch (error: unknown) {
//     // 1. Проверяем, является ли это ошибкой истечения срока JWT (ERR_JWT_EXPIRED)
//     if (error instanceof errors.JWTExpired) {
//       return null
//     }

//     // 2. Проверяем на общие ошибки JWT (невалидная подпись и т.д.)
//     if (error instanceof errors.JOSEError) {
//       console.error("Критическая ошибка JWT:", error.message)
//       return null
//     }

//     if (error instanceof Error) {
//       console.error("Системная ошибка авторизации:", error.message)
//     }

//     return null
//   }
// }
