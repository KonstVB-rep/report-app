"use client"

import type { Dispatch, SetStateAction } from "react"
import { useMutation } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import type { DeepPartial } from "react-hook-form"
import {
  createProject,
  createRetail,
  deleteDeal,
  deleteHighlight,
  deleteMultipleDeals,
  reassignDealsToManager,
  setHighlight,
  updateProject,
  updateRetail,
} from "@/entities/deal/api/deal.actions"
import type { ProjectSchema, RetailSchema } from "@/entities/deal/model/schema"
import {
  DEAL_TYPE,
  type DealFile,
  type DealHighlightType,
  type DealType,
  type DeliveryProject,
  type DeliveryRetail,
  type DirectionProject,
  type DirectionRetail,
  type MutationResponse,
  type ProjectResponse,
  type ReAssignDeal,
  type RetailResponse,
  type RetailWithoutDateCreateAndUpdate,
  type StatusProject,
  type StatusRetail,
} from "@/entities/deal/types"
import { defaultProjectValues, defaultRetailValues } from "@/feature/deals/model/defaultvaluesForm"
import handleErrorSession from "@/shared/auth/handleErrorSession"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import { queryKeys } from "./query"

export interface AppError {
  success: false
  message: string
  error: true
}

interface DeleteResponse {
  managers: { dealId: string; userId: string }[]
  depId: number
}

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (Без any)
// ==========================================

const parseAmount = (value: string | number | undefined | null): string => {
  if (!value) return "0"
  return parseFloat(String(value).replace(/\s/g, "").replace(",", ".")).toString()
}

const formatDateTo9AM = (dateValue: string | Date | undefined | null): Date | null => {
  if (!dateValue) return null
  const date = new Date(dateValue)
  date.setHours(9, 0, 0, 0)
  return date
}

const buildProjectPayload = (data: ProjectSchema, userId: string) => ({
  ...data,
  userId,
  nameDeal: data.nameDeal || "",
  nameObject: data.nameObject || "",
  inn: data.inn || "",
  contact: data.contact || "",
  comments: data.comments || "",
  commentsLastConnection: data.commentsLastConnection || "",
  resource: data.resource || "",
  email: data.email || "",
  phone: data.phone || "",
  deliveryType: (data.deliveryType === "" ? null : data.deliveryType) as DeliveryProject | null,
  dateRequest: formatDateTo9AM(data.dateRequest) || new Date(),
  dealStatus: data.dealStatus as StatusProject,
  lastDateConnection: formatDateTo9AM(data.lastDateConnection),
  plannedDateConnection: formatDateTo9AM(data.plannedDateConnection),
  direction: data.direction as DirectionProject,
  amountCP: parseAmount(data.amountCP),
  amountPurchase: parseAmount(data.amountPurchase),
  amountWork: parseAmount(data.amountWork),
  delta: parseAmount(data.delta),
  managersIds: data.managersIds,
})

const buildRetailPayload = (data: RetailSchema, userId: string) => ({
  ...data,
  userId,
  nameDeal: data.nameDeal || "",
  nameObject: data.nameObject || "",
  inn: data.inn || "",
  contact: data.contact || "",
  comments: data.comments || "",
  commentsLastConnection: data.commentsLastConnection || "",
  resource: data.resource || "",
  email: data.email || "",
  phone: data.phone || "",
  deliveryType: (data.deliveryType === "" ? null : data.deliveryType) as DeliveryRetail | null,
  dateRequest: formatDateTo9AM(data.dateRequest) || new Date(),
  dealStatus: data.dealStatus as StatusRetail,
  lastDateConnection: formatDateTo9AM(data.lastDateConnection),
  plannedDateConnection: formatDateTo9AM(data.plannedDateConnection),
  direction: data.direction as DirectionRetail,
  amountCP: parseAmount(data.amountCP),
  delta: parseAmount(data.delta),
  managersIds: data.managersIds,
})

// Универсальный тип вместо any
type HighlightSuccessData = {
  success: boolean
  type?: DealType
  userId?: string
  message?: string
}

const handleHighlightSuccess = (
  data: HighlightSuccessData | undefined,
  queryClient: ReturnType<typeof useFormSubmission>["queryClient"],
  authUserId: string | undefined,
  action: "set" | "delete",
) => {
  if (!data) return

  if (!data.success) {
    TOAST.ERROR(`Произошла ошибка при ${action === "set" ? "установке" : "удалении"} цвета`)
    return
  }

  if (data.type === DEAL_TYPE.PROJECT && data.userId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.projectsUser(data.userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.contractsUser(data.userId) })
  } else if (data.type === DEAL_TYPE.RETAIL && data.userId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.retailsUser(data.userId) })
  }

  queryClient.invalidateQueries({
    queryKey: queryKeys.colorsHiLightList(authUserId ?? ""),
  })

  TOAST.SUCCESS(`Цвет успешно ${action === "set" ? "установлен" : "удален"}`)
}

// ==========================================
// ХУКИ МУТАЦИЙ
// ==========================================

export const useDelDeal = (closeModalFn: Dispatch<SetStateAction<void>>, type: DealType) => {
  const { queryClient } = useFormSubmission()
  return useMutation({
    mutationFn: async (dealId: string) => {
      const result = await deleteDeal(dealId, type)

      if (!result.success) {
        throw result
      }

      return result.data as DeleteResponse
    },

    onSuccess: (data, dealId) => {
      const depId = data.depId
      const queryType = type.toLowerCase() === "project" ? "projects" : "retails"

      data.managers?.forEach((manager) => {
        queryClient.invalidateQueries({
          queryKey: [queryType, manager.userId],
        })
      })

      queryClient.invalidateQueries({ queryKey: [type.toLowerCase(), dealId] })
      queryClient.invalidateQueries({
        queryKey: queryKeys.allDealsDepartment(Number(depId)),
      })

      closeModalFn()
    },

    onError: (error: unknown) => {
      handleErrorSession(error)
    },
  })
}

export const useDelListDeal = (
  closeModalFn: (dataFiles: DealFile[]) => void,
  departmentId: string,
) => {
  const pathname = usePathname()
  const { queryClient } = useFormSubmission()
  return useMutation({
    mutationFn: async (
      deals: {
        id: string
        type: DealType
      }[],
    ) => {
      if (!departmentId) return
      return await deleteMultipleDeals(deals, Number(departmentId))
    },
    onSuccess: (data) => {
      // Восстановлен оригинальный блок onSuccess
      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-deals-department", Number(departmentId)],
        })
      }

      // Оптимизация: инвалидируем всегда, так как данные изменились
      queryClient.invalidateQueries({
        queryKey: queryKeys.allDealsDepartment(Number(departmentId)),
      })

      closeModalFn(data?.files || [])
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useMutationUpdateProject = (
  dealId: string,
  userId: string,
  close: () => void,
  isInvalidate: boolean = false,
) => {
  const { queryClient, authUser } = useFormSubmission()

  return useMutation({
    mutationFn: async (data: ProjectSchema) => {
      const formData = buildProjectPayload(data, userId)

      const result = await updateProject(formData)

      if (!result.success) {
        throw result
      }

      return result.data
    },
    onError: (error: MutationResponse<never>) => {
      if (error.code === 401) {
        handleErrorSession(error)
      }
    },

    onSuccess: (_, variables) => {
      // Оригинальный блок onSuccess
      close()
      const depId = Number(authUser?.departmentId)

      if (isInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["project", dealId] })
      }

      queryClient.invalidateQueries({ queryKey: ["orders", depId] })

      const currManagers = variables.managersIds?.map((m) => m.userId) || []
      const allManagers = [...new Set([...currManagers, userId])]

      allManagers.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ["projects", id] })
        queryClient.invalidateQueries({ queryKey: ["contracts", id, depId] })
      })
    },
  })
}

export const useMutationUpdateRetail = (
  dealId: string,
  userId: string,
  close: () => void,
  isInvalidate: boolean = false,
) => {
  const { queryClient, authUser } = useFormSubmission()
  return useMutation({
    mutationFn: async (
      data: RetailSchema,
    ): Promise<RetailWithoutDateCreateAndUpdate | null | undefined> => {
      const formData = buildRetailPayload(data, userId)

      const result = await updateRetail(formData)

      if (!result.success) {
        throw result
      }

      return result.data
    },

    onError: (error) => {
      handleErrorSession(error)
    },
    onSuccess: (_, variables) => {
      // Оригинальный блок onSuccess
      close()

      const previousData = queryClient.getQueryData<RetailResponse>(["retail", dealId])
      const prevManagers = previousData?.managers?.map((m) => m.id).sort() || []
      const currManagers = variables.managersIds?.map((m) => m.userId).sort() || []

      if (isInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["retail", dealId] })
      }

      queryClient.invalidateQueries({
        queryKey: ["orders", Number(authUser?.departmentId)],
      })

      const allManagers = [...new Set([...prevManagers, ...currManagers, userId])]
      allManagers.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ["retails", id] })
      })
    },
  })
}

export const useCreateProject = (reset: (values?: DeepPartial<ProjectSchema>) => void) => {
  const { queryClient, authUser } = useFormSubmission()
  return useMutation({
    mutationFn: async (data: ProjectSchema) => {
      const formData = buildProjectPayload(data, authUser?.id || "")
      return await createProject(formData)
    },

    onSuccess: (data: ProjectResponse) => {
      // Оригинальный блок onSuccess
      reset(defaultProjectValues)
      queryClient.invalidateQueries({
        queryKey: ["projects", data.userId],
        exact: true,
      })

      queryClient.invalidateQueries({
        queryKey: ["orders", authUser?.departmentId],
        exact: true,
      })
      queryClient.invalidateQueries({
        queryKey: ["all-deals-department", authUser?.departmentId, authUser?.id],
      })
    },

    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useCreateRetail = (reset: (values?: DeepPartial<RetailSchema>) => void) => {
  const { queryClient, authUser } = useFormSubmission()

  return useMutation({
    mutationFn: async (data: RetailSchema) => {
      if (!authUser?.id) throw new Error("Пользователь не авторизован")

      const formData = buildRetailPayload(data, authUser.id)

      return await createRetail(formData)
    },

    onSuccess: (data: RetailResponse) => {
      // Оригинальный блок onSuccess
      reset(defaultRetailValues)

      queryClient.invalidateQueries({
        queryKey: ["retails", data.userId],
        exact: true,
      })

      queryClient.invalidateQueries({
        queryKey: ["projects", data.userId],
        exact: true,
      })

      queryClient.invalidateQueries({
        queryKey: ["orders", authUser?.departmentId],
        exact: true,
      })

      if (authUser?.departmentId)
        queryClient.invalidateQueries({
          queryKey: queryKeys.allDealsDepartment(authUser?.departmentId),
        })
    },

    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useReassignDeal = (setOpenModal: (value: boolean) => void) => {
  const { queryClient, authUser } = useFormSubmission()

  return useMutation<Awaited<ReturnType<typeof reassignDealsToManager>>, AppError, ReAssignDeal>({
    mutationFn: async (data: ReAssignDeal) => {
      const result = await reassignDealsToManager(data)

      if (result.error) {
        throw result
      }

      return result
    },
    onSuccess: (data) => {
      // Оригинальный блок onSuccess
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ["orders", authUser?.departmentId],
          exact: true,
        })

        if (authUser?.departmentId)
          queryClient.invalidateQueries({
            queryKey: queryKeys.allDealsDepartment(authUser?.departmentId),
          })

        TOAST.SUCCESS(data.message)
      }

      if (!data.success) {
        TOAST.ERROR(data.message)
      }

      setOpenModal(false)
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useSetHilight = () => {
  const { queryClient, authUser } = useFormSubmission()
  return useMutation({
    mutationFn: async (data: DealHighlightType) => {
      return await setHighlight(data)
    },
    onSuccess: (data) => {
      // Используем хелпер с правильными типами
      handleHighlightSuccess(data, queryClient, authUser?.id ?? undefined, "set")
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useDeleteHilight = () => {
  const { queryClient, authUser } = useFormSubmission()
  return useMutation({
    mutationFn: async (data: DealHighlightType) => {
      return await deleteHighlight(data)
    },
    onSuccess: (data) => {
      // Используем хелпер с правильными типами
      handleHighlightSuccess(data, queryClient, authUser?.id ?? undefined, "delete")
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}
