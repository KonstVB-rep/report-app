import type { DealFile } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { requireUser } from "@/app/api/utils/requireAuth "
import axiosInstance from "@/shared/api/axiosInstance"
import handleErrorSession from "@/shared/auth/handleErrorSession"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import { downloadFile, uploadFile } from "../api/action_route"
import { saveBlobToFile } from "../libs/helpers/saveBlobToFile"

export const useUploadFileYdxDisk = () => {
  const { queryClient, authUser } = useFormSubmission()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      if (!authUser?.id) throw new Error("Пользователь не авторизован")

      const response = await uploadFile(formData)

      if (!response?.data.success) {
        throw new Error("Ошибка при загрузке файла")
      }

      const { data: fileData } = response.data
      return fileData
    },
    onSuccess: (data) => {
      const { dealId, dealType, userId } = data[0]

      TOAST.SUCCESS("Файл успешно загружен")

      queryClient.invalidateQueries({
        queryKey: ["get-deal-files", userId, dealId, dealType],
      })
      queryClient.invalidateQueries({ queryKey: ["info-yandex-disk"] })

      queryClient.invalidateQueries({
        queryKey: [dealType.toLowerCase(), dealId],
      })
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useDownLoadFile = () => {
  return useMutation({
    mutationFn: async (data: { localPath: string; name: string }) => {
      const { localPath, name } = data

      const response = await downloadFile({ filePath: localPath })

      if (!response?.data) {
        throw new Error("Файл не найден")
      }

      const fileData = response.data
      return saveBlobToFile(fileData, name)
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

// export const useDeleteFiles = (handleCloseDialog?: React.Dispatch<React.SetStateAction<void>>) => {
//   const { queryClient, authUser, isSubmittingRef } = useFormSubmission()

//   return useMutation({
//     mutationFn: async (data: DealFile[]) => {
//       if (isSubmittingRef.current) {
//         throw new Error("Операция уже выполняется") // ✅ Явная ошибка вместо return
//       }

//       isSubmittingRef.current = true
//       try {
//         await checkAuthorization(authUser?.id)

//         const responses = await Promise.all(
//           data.map(({ localPath: filePath, id, dealType, userId, dealId }) =>
//             deleteFile({ id, filePath, dealType, userId, dealId }),
//           ),
//         )
//         return responses.map((r) => r.data)
//       } finally {
//         isSubmittingRef.current = false // 🔄 Гарантированный сброс
//       }
//     },
//     onSuccess: (data) => {
//       if (!data) {
//         return
//       }
//       TOAST.SUCCESS("Данные успешно удалены")

//       const { userId, dealId, dealType } = data[0]

//       queryClient.invalidateQueries({
//         queryKey: ["get-deal-files", userId, dealId, dealType],
//       })

//       queryClient.invalidateQueries({ queryKey: ["info-yandex-disk"] })

//       queryClient.invalidateQueries({
//         queryKey: [dealType.toLowerCase(), dealId],
//       })

//       isSubmittingRef.current = false

//       handleCloseDialog?.()
//     },
//     onError: (error) => {
//       handleErrorSession(error)
//     },
//   })
// }

export const useDeleteFiles = (handleCloseDialog?: () => void) => {
  const { queryClient } = useFormSubmission()

  return useMutation({
    mutationFn: async (files: DealFile[]) => {
      await requireUser()

      // Отправляем весь массив одним запросом
      const response = await axiosInstance.delete(`/yandex-disk/delete`, {
        data: files.map((f) => ({
          id: f.id,
          filePath: f.localPath,
          dealType: f.dealType,
          userId: f.userId,
          dealId: f.dealId,
        })),
      })
      return { results: response.data, originalFiles: files }
    },
    onSuccess: ({ originalFiles }) => {
      TOAST.SUCCESS("Операция завершена")

      if (originalFiles.length > 0) {
        const { userId, dealId, dealType } = originalFiles[0]

        // Инвалидация только нужных данных
        queryClient.invalidateQueries({
          queryKey: ["get-deal-files", userId, dealId, dealType],
        })
        queryClient.invalidateQueries({ queryKey: ["info-yandex-disk"] })
      }

      handleCloseDialog?.()
    },
    onError: (error) => handleErrorSession(error),
  })
}
