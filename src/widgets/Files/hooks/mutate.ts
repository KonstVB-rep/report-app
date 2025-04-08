import { TOAST } from "@/entities/user/ui/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile, downloadFile, uploadFile } from "../api/action_route";
import { DealType } from "@prisma/client";
import useStoreUser from "@/entities/user/store/useStoreUser";

import { saveBlobToFile } from "../libs/helpers/saveBlobToFile";

export const useUploadFileYdxDisk = () => {
  const queryClient = useQueryClient();
  const { isAuth } = useStoreUser();

  // Мутация для загрузки файла на Яндекс.Диск
  return useMutation({
    mutationFn: async (formData: FormData) => {
      if (!isAuth) throw new Error("Пользователь не авторизован");

      const response = await uploadFile(formData);

      if (!response.success) {
        throw new Error("Ошибка при загрузке файла");
      }
      return response.data;
    },
    onSuccess: (data) => {
      const { dealId, dealType, userId } = data;

      TOAST.SUCCESS(
        "Файл успешно загружен"
      );
      queryClient.invalidateQueries({
        queryKey: ["get-deal-files", userId, dealId, dealType],
      });
      queryClient.invalidateQueries({ queryKey: ["info-yandex-disk"] });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};

export const useDeleteFile = (
  id: string,
  dealType: DealType,
  userId: string
) => {
  const queryClient = useQueryClient();

  const { isAuth } = useStoreUser();

  return useMutation({
    mutationFn: async (filePath: string) => {
      if (!isAuth) throw new Error("Пользователь не авторизован");
      const response = await deleteFile({ id, filePath, dealType, userId });
      return response.data;
    },
    onSuccess: (data) => {
      const { userId, dealId } = data;
      TOAST.SUCCESS("Файл успешно удален");
      queryClient.invalidateQueries({
        queryKey: ["get-deal-files", userId, dealId, dealType],
      });
      queryClient.invalidateQueries({ queryKey: ["info-yandex-disk"] });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};

export const useDownLoadFile = () => {
  const { isAuth } = useStoreUser();
  return useMutation({
    mutationFn: async (data:{localPath: string, name: string}) => {
      if (!isAuth) throw new Error("Пользователь не авторизован");
      const { localPath, name } = data;
      const response = await downloadFile(localPath);
      return saveBlobToFile(response, name);
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};
