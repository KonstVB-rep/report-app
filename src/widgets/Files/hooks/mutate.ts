import { TOAST } from "@/entities/user/ui/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "../api/action_ydx_disk";
import useStoreUser from "@/entities/user/store/useStoreUser";

import { writeHrefDownloadFileInDB } from "../api/actions_db";

export const useUploadFileYdxDisk = ({userId,dealId, dealType}: {userId: string, dealId: string, dealType: string}) => {
    const queryClient = useQueryClient();
    const { isAuth } = useStoreUser();
    return useMutation({
        mutationKey: ["upload-file", userId, dealId, dealType ],
        mutationFn: async (formData: FormData) => {
            if (!isAuth) throw new Error("Пользователь не авторизован");
      
            // Шаг 1: Загружаем файл на Яндекс.Диск
            const uploadResponse = await uploadFile(formData);
            
            // Шаг 2: Обновляем запись в базе данных с данными о файле
            const fileInfo = await writeHrefDownloadFileInDB(formData);
            
            // Шаг 3: Возвращаем как результат успешной загрузки
            return { uploadResponse, fileInfo };
          },
          onSuccess: (data) => {
            const { uploadResponse, fileInfo } = data;
            console.log("Файл успешно загружен на Яндекс.Диск:", uploadResponse);
            console.log("Информация о файле в базе данных:", fileInfo);
            
            queryClient.invalidateQueries({ queryKey: ["deal-files", fileInfo.userId, fileInfo.dealId, fileInfo.dealType] });
            TOAST.SUCCESS(`Файл успешно загружен: ${fileInfo.name}`);
          },
        onError: () => TOAST.ERROR("Ошибка загрузки файла"),
    });
}