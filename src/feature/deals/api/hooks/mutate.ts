"use client"

import type { Dispatch, SetStateAction } from "react"
import type {
  DealFile,
  DealType,
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import type { DeepPartial } from "react-hook-form"
import {
  createProject,
  createRetail,
  deleteDeal,
  deleteMultipleDeals,
  type MutationResponse,
  reassignDealsToManager,
  setHighlight,
  updateProject,
  updateRetail,
} from "@/entities/deal/api/deal.actions"
import type { ProjectSchema, RetailSchema } from "@/entities/deal/model/schema"
import {
  DEAL_TYPE,
  type DealHighlightType,
  type ProjectResponse,
  type ReAssignDeal,
  type RetailResponse,
  type RetailWithoutDateCreateAndUpdate,
} from "@/entities/deal/types"
import { defaultProjectValues, defaultRetailValues } from "@/feature/deals/model/defaultvaluesForm"
import handleErrorSession from "@/shared/auth/handleErrorSession"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import { queryKeys } from "./query"

export interface AppError {
  success: false
  message: string
  error: true
}

interface DeleteResponse {
  managers: { dealId: string; userId: string }[]
}

export const useDelDeal = (closeModalFn: Dispatch<SetStateAction<void>>, type: DealType) => {
  const { queryClient, authUser } = useFormSubmission()
  return useMutation({
    mutationFn: async (dealId: string) => {
      const result = await deleteDeal(dealId, type)

      if (!result.success) {
        throw result
      }

      return result.data as DeleteResponse
    },

    onSuccess: (data, dealId) => {
      const depId = Number(authUser?.departmentId)
      const queryType = type.toLowerCase() === "project" ? "projects" : "retails"

      data.managers?.forEach((manager) => {
        queryClient.invalidateQueries({
          queryKey: [queryType, manager.userId],
        })
      })

      queryClient.invalidateQueries({ queryKey: [type.toLowerCase(), dealId] })
      queryClient.invalidateQueries({ queryKey: ["orders", depId] })

      closeModalFn()
    },

    onError: (error: unknown) => {
      handleErrorSession(error)
    },
  })
}

export const useDelListDeal = (closeModalFn: (dataFiles: DealFile[]) => void) => {
  const pathname = usePathname()
  const { queryClient, authUser } = useFormSubmission()
  return useMutation({
    mutationFn: async (
      deals: {
        id: string
        type: DealType
      }[],
    ) => {
      return await deleteMultipleDeals(deals)
    },
    onSuccess: (data) => {
      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-deals-department", authUser?.departmentId, authUser?.id],
        })
      }

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
      const formData = {
        ...data,
        dateRequest: data.dateRequest
          ? new Date(new Date(data.dateRequest).setHours(9, 0, 0, 0))
          : new Date(),
        email: data.email || "",
        phone: data.phone || "",
        deliveryType: data.deliveryType as DeliveryProject,
        dealStatus: data.dealStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(new Date(data.plannedDateConnection).setHours(9, 0, 0, 0))
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(data.amountCP.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        amountPurchase: data.amountPurchase
          ? parseFloat(data.amountPurchase.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        amountWork: data.amountWork
          ? parseFloat(data.amountWork.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        delta: data.delta
          ? parseFloat(data.delta.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        managersIds: data.managersIds,
      }

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
      const formData = {
        ...data,
        dateRequest: data.dateRequest
          ? new Date(new Date(data.dateRequest).setHours(9, 0, 0, 0))
          : new Date(),
        email: data.email || "",
        phone: data.phone || "",
        deliveryType: data.deliveryType as DeliveryRetail,
        dealStatus: data.dealStatus as StatusRetail,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(new Date(data.plannedDateConnection).setHours(9, 0, 0, 0))
          : null,
        direction: data.direction as DirectionRetail,
        amountCP: data.amountCP
          ? parseFloat(data.amountCP.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        delta: data.delta
          ? parseFloat(data.delta.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        managersIds: data.managersIds,
      }

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
      const formData = {
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        deliveryType: data.deliveryType === "" ? null : (data.deliveryType as DeliveryProject),
        dateRequest: data.dateRequest
          ? new Date(new Date(data.dateRequest).setHours(9, 0, 0, 0))
          : new Date(),
        dealStatus: data.dealStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(new Date(data.plannedDateConnection).setHours(9, 0, 0, 0))
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(data.amountCP.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        amountPurchase: data.amountPurchase
          ? parseFloat(data.amountPurchase.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        amountWork: data.amountWork
          ? parseFloat(data.amountWork.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        delta: data.delta
          ? parseFloat(data.delta.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        managersIds: data.managersIds,
      }
      return await createProject(formData)
    },

    onSuccess: (data: ProjectResponse) => {
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

      const formData = {
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        deliveryType: data.deliveryType === "" ? null : (data.deliveryType as DeliveryRetail),
        dateRequest: data.dateRequest
          ? new Date(new Date(data.dateRequest).setHours(9, 0, 0, 0))
          : new Date(),
        dealStatus: data.dealStatus as StatusRetail,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(new Date(data.plannedDateConnection).setHours(9, 0, 0, 0))
          : null,
        direction: data.direction as DirectionRetail,
        amountCP: data.amountCP
          ? parseFloat(data.amountCP.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        delta: data.delta
          ? parseFloat(data.delta.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        managersIds: data.managersIds,
      }

      return await createRetail(formData)
    },

    onSuccess: (data: RetailResponse) => {
      reset(defaultRetailValues)

      queryClient.invalidateQueries({
        queryKey: ["retails", data.userId],
        exact: true,
      })

      queryClient.invalidateQueries({
        queryKey: ["orders", authUser?.departmentId],
        exact: true,
      })

      queryClient.invalidateQueries({
        queryKey: ["all-deals-department", authUser?.departmentId, authUser?.id],
        exact: true,
      })
    },

    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useReassignDeal = () => {
  const { queryClient, authUser } = useFormSubmission()

  return useMutation<Awaited<ReturnType<typeof reassignDealsToManager>>, AppError, ReAssignDeal>({
    mutationFn: async (data: ReAssignDeal) => {
      const result = await reassignDealsToManager(data)

      if (result.error) {
        throw result
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-deals-department", authUser?.departmentId, authUser?.id],
      })
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
      if (!data) {
        return
      }

      if (data.type === DEAL_TYPE.PROJECT) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projectsUser(data.userId),
        })
        queryClient.invalidateQueries({
          queryKey: queryKeys.contractsUser(data.userId),
        })
      }
      if (data.type === DEAL_TYPE.RETAIL) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.retailsUser(data.userId),
        })
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.colorsHiLightList(authUser?.id || ""),
      })
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}
