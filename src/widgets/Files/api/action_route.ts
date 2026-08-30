import type { AxiosResponse } from "axios"
import axiosInstance from "@/shared/api/axiosInstance"

export const uploadFile = async (formData: FormData): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post("/yandex-disk/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response
  } catch (error) {
    console.error("Ошибка загрузки:", error)
    throw new Error((error as Error).message)
  }
}

export const downloadFile = async (data: { filePath: string }): Promise<AxiosResponse> => {
  try {
    const { filePath } = data
    const response = await axiosInstance.get("/yandex-disk/download", {
      params: { filePath },
      responseType: "blob",
    })

    if (!response.data) {
      throw new Error("Файл не найден")
    }

    return response
  } catch (error) {
    console.error("Ошибка загрузки файла:", error)
    throw new Error("Ошибка загрузки файла")
  }
}
