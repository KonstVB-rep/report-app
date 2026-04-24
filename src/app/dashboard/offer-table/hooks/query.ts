import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getEquipments } from "../actions/offer.actions"
import { ERROR_TEXT } from "@/shared/types"

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
