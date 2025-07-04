import axiosInstance from "@/shared/api/axiosInstance";
import { resetAllStores } from "@/shared/lib/helpers/сreate";

export const logout = async () => {
  try {
    // 1. Серверная очистка cookies
    await axiosInstance.post("/auth/logout");
    
    // 2. Клиентская очистка (выбираем ОДИН вариант)
    resetAllStores(); // Предпочтительно, если у вас много хранилищ
    
    // 3. Жёсткий переход с гарантией сброса
    window.location.href = "/login";
    
  } catch (error) {
    console.error("Ошибка при выходе:", error);
    throw error;
  }
};