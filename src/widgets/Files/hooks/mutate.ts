import { DealFile } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { AxiosResponse } from "axios";

import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";
import { checkAuthorization } from "@/shared/lib/helpers/checkAuthorization";
import { TOAST } from "@/shared/ui/Toast";

import { deleteFile, downloadFile, uploadFile } from "../api/action_route";
import { saveBlobToFile } from "../libs/helpers/saveBlobToFile";
import handleErrorSession from "@/shared/auth/handleErrorSession";

export const useUploadFileYdxDisk = () => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      if (!authUser?.id) throw new Error("Пользователь не авторизован");

      const response = await handleMutationWithAuthCheck<
        FormData,
        AxiosResponse
      >(uploadFile, formData, authUser, isSubmittingRef);

      if (!response?.data.success) {
        throw new Error("Ошибка при загрузке файла");
      }

      const { data: fileData } = response.data;
      return fileData;
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
       handleErrorSession(error)
    },
  });
};

export const useDownLoadFile = () => {
  const { authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: async (data: { localPath: string; name: string }) => {
      const { localPath, name } = data;

      const response = await handleMutationWithAuthCheck<
        { filePath: string },
        AxiosResponse
      >(downloadFile, { filePath: localPath }, authUser, isSubmittingRef);

      if (!response?.data) {
        throw new Error("Файл не найден");
      }

      const fileData = response.data;
      return saveBlobToFile(fileData, name);
    },
    onError: (error) => {
       handleErrorSession(error)
    },
  });
};

export const useDeleteFiles = (
  handleCloseDialog?: React.Dispatch<React.SetStateAction<void>>
) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (data: DealFile[]) => {
      if (isSubmittingRef.current) {
        throw new Error("Операция уже выполняется"); // ✅ Явная ошибка вместо return
      }

      isSubmittingRef.current = true;
      try {
        await checkAuthorization(authUser?.id);
        
        const responses = await Promise.all(
          data.map(({ localPath: filePath, id, dealType, userId, dealId }) =>
            deleteFile({ id, filePath, dealType, userId, dealId })
          )
        );
        return responses.map((r) => r.data);
      } finally {
        isSubmittingRef.current = false; // 🔄 Гарантированный сброс
      }
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      TOAST.SUCCESS("Данные успешно удалены");

      const { userId, dealId, dealType } = data[0];

      queryClient.invalidateQueries({
        queryKey: ["get-deal-files", userId, dealId, dealType],
      });

      queryClient.invalidateQueries({ queryKey: ["info-yandex-disk"] });

      queryClient.invalidateQueries({
        queryKey: [dealType.toLowerCase(), dealId],
      });

      isSubmittingRef.current = false;

      handleCloseDialog?.();
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  });
};
