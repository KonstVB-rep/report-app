import { useMutation } from "@tanstack/react-query"
import handleErrorSession from "@/shared/auth/handleErrorSession"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import {
  addEquipment,
  addToKit,
  deleteEquipmentList,
  deleteFromKit,
  deleteOfferTemplate,
  saveOfferTemplate,
  updateEquipmentsList,
} from "../actions/offer.actions"
import type { EquipmentFormValues } from "../components/AddNewEquipmentDialog"
import type { EquipmentDb, EquipmentWithQuantity } from "../lib/types"
import type { DataOffer } from "../store"

export const useAddEquipment = (reset: (values: EquipmentFormValues) => void) => {
  const { queryClient } = useFormSubmission()
  return useMutation({
    mutationFn: async (item: EquipmentFormValues) => {
      return await addEquipment(item)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["equipments"],
      })
      reset({
        name: "",
        image: "",
        isKit: false,
        description: "",
        price: "0,00",
      })
    },
    onError: (error: unknown) => {
      handleErrorSession(error)
    },
  })
}

export const useAddItemsToKit = () => {
  const { queryClient } = useFormSubmission()
  return useMutation({
    mutationFn: async (data: { kitId: string; itemsKit: EquipmentWithQuantity[] }) => {
      return await addToKit(data.kitId, data.itemsKit)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["equipments"],
      })
      TOAST.SUCCESS("Состав комплекта обновлен")
    },
    onError: (error: unknown) => {
      handleErrorSession(error)
    },
  })
}

export const useDeleteEquipments = () => {
  const { queryClient } = useFormSubmission()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      return await deleteEquipmentList(ids)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] })
    },

    onError: (error: unknown) => {
      handleErrorSession(error)
    },
  })
}

export const useUpdateEquipments = () => {
  const { queryClient } = useFormSubmission()
  return useMutation({
    mutationFn: async (items: Partial<EquipmentDb>[]) => {
      return await updateEquipmentsList(items)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] })
    },
    onError: (error: unknown) => {
      handleErrorSession(error)
    },
  })
}

export const useDeleteFromKit = () => {
  const { queryClient } = useFormSubmission()

  return useMutation({
    mutationFn: async (data: { idKit: string; idsKitItem: string[] }) => {
      return await deleteFromKit(data.idKit, data.idsKitItem)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] })
    },
    onError: (error: unknown) => {
      handleErrorSession(error)
    },
  })
}

export const useSaveOfferTemplate = () => {
  const { queryClient } = useFormSubmission()
  return useMutation({
    mutationFn: async (data: { data: DataOffer; name: string }) => {
      return await saveOfferTemplate(data.data, data.name)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerTemplates"] })
      TOAST.SUCCESS("Шаблон сохранен")
    },
    onError: (error: unknown) => {
      handleErrorSession(error)
    },
  })
}

export const useDeleteOfferTemplate = () => {
  const { queryClient } = useFormSubmission()
  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteOfferTemplate(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerTemplates"] })
    },
    onError: (error: unknown) => {
      handleErrorSession(error)
    },
  })
}
