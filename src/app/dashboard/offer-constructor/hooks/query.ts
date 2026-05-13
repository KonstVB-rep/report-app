import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ERROR_TEXT } from "@/shared/types"
import { getEquipments, getOfferTemplates } from "../actions/offer.actions"

export const useGetEquipments = () => {
  return useQuery({
    queryKey: ["equipments"],
    queryFn: async () => {
      return await getEquipments()
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    retry: 2,
    meta: {
      errorMessage: ERROR_TEXT,
    },
  })
}

export const useGetOfferTemplates = () => {
  return useQuery({
    queryKey: ["offerTemplates"],
    queryFn: async () => {
      return await getOfferTemplates()
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    retry: 2,
    meta: {
      errorMessage: ERROR_TEXT,
    },
  })
}
