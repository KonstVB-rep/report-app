import axiosInstance from "@/shared/api/axiosInstance";

export const uploadFile = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post("/yandex-disk/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
      } catch (error) {
        console.error("Ошибка загрузки на Яндекс.Диск:", error);
        throw new Error("Ошибка загрузки файла на Яндекс.Диск");
      }
  };
  

  export const downloadFile = async (filePath: string) => {
    try {
      const response = await axiosInstance.get(`/yandex-disk/download?filePath=${filePath}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки файла с Яндекс.Диск:", error);
      throw new Error("Ошибка загрузки файла с Яндекс.Диск");
    }
  };