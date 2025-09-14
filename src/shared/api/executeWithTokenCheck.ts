import { checkTokens } from "../lib/helpers/checkTokens";

export const executeWithTokenCheck = async <T>(
  actionFn: () => Promise<T>
): Promise<T> => {
  try {
    const [tokenCheckResult, result] = await Promise.all([
      checkTokens(),
      actionFn(),
    ]);
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
