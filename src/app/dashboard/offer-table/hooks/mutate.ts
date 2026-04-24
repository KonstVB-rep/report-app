import handleErrorSession from "@/shared/auth/handleErrorSession"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import { EquipmentItem } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { DeepPartial } from "react-hook-form"
import { addEquipment, deleteEquipmentList, updateEquipmentsList } from "../actions/offer.actions"
import { EquipmentDb, Equipment } from "../lib/types"

export const useAddEquipment = (reset: (values?: DeepPartial<Equipment>) => void) => {
  const { queryClient } = useFormSubmission()
  return useMutation({
    mutationFn: async (item: EquipmentItem) => {
      return await addEquipment(item)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["equipments"],
      })
      reset({
        name: "",
        image: "",
        description: "",
        price: "0",
      })
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
