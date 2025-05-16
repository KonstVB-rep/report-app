"use server";

// Используем jose для верификации токенов
import { cookies } from "next/headers";

import { jwtVerify } from "jose";

interface DecodedToken {
  userId: string;
}

// Получаем текущего/делающего запрос пользователя
export async function getUserIdFromRequest(): Promise<string | null> {
  const cookieStore = await cookies();

  const cookie = cookieStore.get("access_token"); //

  // Если куки нет или нет значения, возвращаем null
  if (!cookie || !cookie.value) {
    return null;
  }

  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY); // Кодируем ключ в нужный формат
    const { payload } = await jwtVerify(cookie.value, secretKey); // Проверка и декодирование токена

    // Преобразуем payload в unknown и проверяем наличие userId
    const decodedPayload = payload as unknown;

    // Проверяем, что userId существует в decodedPayload
    if (
      typeof decodedPayload === "object" &&
      decodedPayload !== null &&
      "userId" in decodedPayload
    ) {
      const decodedToken = decodedPayload as DecodedToken; // Теперь мы уверены, что в payload есть userId
      return decodedToken.userId;
    }

    console.error("Токен не содержит userId");
    return null; // Если в токене нет userId, возвращаем null
  } catch (error) {
    console.error("Ошибка при декодировании токена", error);
    return null; // В случае ошибки возвращаем null
  }
}
