import { DealFile } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { logout } from "@/feature/auth/logout";
import { TOAST } from "@/shared/ui/Toast";

import { deleteFile, downloadFile, uploadFile } from "../api/action_route";
import { saveBlobToFile } from "../libs/helpers/saveBlobToFile";

export const useUploadFileYdxDisk = () => {
  const queryClient = useQueryClient();
  const { isAuth } = useStoreUser();

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
      const { dealId, dealType, userId } = data[0];

      TOAST.SUCCESS("Файл успешно загружен");

      queryClient.invalidateQueries({
        queryKey: ["get-deal-files", userId, dealId, dealType],
      });
      queryClient.invalidateQueries({ queryKey: ["info-yandex-disk"] });

      queryClient.invalidateQueries({
        queryKey: [dealType.toLowerCase(), dealId],
      });
    },
    onError: (error) => {
      const err = error as Error & { status?: number };

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch"
          ? "Ошибка соединения"
          : "Ошибка при загрузки файлов на Яндекс диск";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useDownLoadFile = () => {
  const { isAuth } = useStoreUser();
  return useMutation({
    mutationFn: async (data: { localPath: string; name: string }) => {
      if (!isAuth) throw new Error("Пользователь не авторизован");

      const { localPath, name } = data;

      const response = await downloadFile(localPath);

      if (!response) {
        throw new Error("Файл не найден");
      }

      return saveBlobToFile(response, name);
    },
    onError: (error) => {
      const err = error as Error & { status?: number };

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch"
          ? "Ошибка соединения"
          : "Ошибка при загрузки файлов";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useDeleteFiles = (
  handleCloseDialog?: React.Dispatch<React.SetStateAction<void>>
) => {
  const queryClient = useQueryClient();
  const { isAuth } = useStoreUser();

  return useMutation({
    mutationFn: async (data: DealFile[]) => {
      if (!isAuth) throw new Error("Пользователь не авторизован");

      const responses = await Promise.all(
        data.map(({ localPath: filePath, id, dealType, userId,dealId }) =>
          deleteFile({ id, filePath, dealType, userId,dealId })
        )
      );

      return responses.map((r) => r.data);
    },
    onSuccess: (data) => {
      TOAST.SUCCESS("Данные успешно удалены");

      const { userId, dealId, dealType } = data[0];

      queryClient.invalidateQueries({
        queryKey: ["get-deal-files", userId, dealId, dealType],
      });

      queryClient.invalidateQueries({ queryKey: ["info-yandex-disk"] });

      queryClient.invalidateQueries({
        queryKey: [dealType.toLowerCase(), dealId],
      });

      handleCloseDialog?.();
    },
    onError: (error) => {
      const err = error as Error & { status?: number };

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch"
          ? "Ошибка соединения"
          : "Ошибка при удалении файла";

      TOAST.ERROR(errorMessage);
    },
  });
};
