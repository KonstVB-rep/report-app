// import { NextResponse } from "next/server";

// export const checkAuthorization = async (userId: string | null) => {
//   if (!userId) {
//     return NextResponse.json({ error: "Пользователь не авторизован" }, { status: 401 });
//   }
//   return null; // Если авторизация прошла успешно, возвращаем null
// };

// export const checkAuthorization = async (userId: string | null) => {
//   if (!userId) {
//     return {
//       data: null,
//       message: "Пользователь не авторизован",
//       error: true,
//     }
//   }
//   return null; // Если авторизация прошла успешно, возвращаем null
// };