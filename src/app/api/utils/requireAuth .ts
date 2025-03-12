import { getUserIdFromRequest } from "./getUserIdFromRequest";

export const requireAuth = async (): Promise<string> => {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      throw new Error("Пользователь не авторизован");
    }
    return userId;
  };