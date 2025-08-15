import { checkTokens } from "../lib/helpers/checkTokens";

export const executeWithTokenCheck = async <T>(
  actionFn: () => Promise<T> // Функция, которую нужно выполнить, если токены действительны
): Promise<T> => {
  try {
    const [tokenCheckResult, result] = await Promise.all([
      checkTokens(),
      actionFn(),
    ]);

    // Если проверка токенов прошла успешно, возвращаем результат второй функции
    if (tokenCheckResult) {
      return result;
    } else {
      throw new Error("Сессия недействительна");
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    throw error;
  }
};
