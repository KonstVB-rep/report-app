import axiosInstance from "@/shared/api/axiosInstance"
import { resetAllStores } from "@/shared/lib/helpers/сreate"

export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout")

    resetAllStores()

    window.location.href = "/login"
  } catch (error) {
    console.error("Ошибка при выходе:", error)
    throw error
  }
}
