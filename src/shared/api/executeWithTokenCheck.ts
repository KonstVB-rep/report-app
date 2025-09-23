import { createPrerenderSearchParamsForClientPage } from "next/dist/server/request/search-params";

import { checkTokens } from "../lib/helpers/checkTokens";

export const executeWithTokenCheck = async <T>(
  actionFn: () => Promise<T>,
  signal?: AbortSignal
): Promise<T> => {
  try {
    // Проверяем не отменен ли уже запрос
    if (signal?.aborted) {
      throw new Error("Request aborted");
    }

    const tokenCheckResult = await checkTokens();

    // Снова проверяем после долгой операции
    if (signal?.aborted) {
      throw new Error("Request aborted");
    }

    if (!tokenCheckResult) {
      throw new Error("Сессия недействительна");
    }

    return await actionFn();
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    throw error;
  }
};
