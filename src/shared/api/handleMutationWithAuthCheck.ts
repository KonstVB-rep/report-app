import { User } from "@/entities/user/types";

import { checkTokens } from "../lib/helpers/checkTokens";

// Общая логика для блокировки отправки и проверки авторизации
const handleMutationWithAuthCheck = async <T, U>(
  mutateFn: (data: T) => Promise<U>, // Основная функция для мутации
  data: T,
  authUser: User | null,
  isSubmittingRef: React.RefObject<boolean> // Ссылка для блокировки отправки
) => {
  if (isSubmittingRef.current) {
    throw new Error("Операция уже выполняется");
  }

  isSubmittingRef.current = true; // Блокируем отправку

  if (!authUser?.id) {
    throw new Error("User ID is missing");
  }

  try {
    await checkTokens(); // Проверка авторизации

    return await mutateFn(data); // Выполнение основной мутации
  } catch (error) {
    console.error("Error in mutation:", error);
    throw error;
  } finally {
    isSubmittingRef.current = false; // Разблокируем отправку
  }
};

export default handleMutationWithAuthCheck;
