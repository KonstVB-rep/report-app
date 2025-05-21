import axiosInstance from "@/shared/api/axiosInstance";

export async function logout() {
  try {
    const response = await axiosInstance.post("/auth/logout");

    console.log("Вы успешно вышли из системы", response.data);

    return response.data;
  } catch (error) {
    console.error("Ошибка при выходе из системы:", error);
    throw new Error("Не удалось выполнить выход из системы");
  }
}
