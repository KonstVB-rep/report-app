// src/features/find-organization-by-inn/api/useFindOrganization.ts
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import handleErrorSession from "@/shared/auth/handleErrorSession"
import { getOrganizationByQueryAction } from "../actions/getOrganizationByQueryAction"

export type CompanySuggestionItem = {
  id: string
  inn: string | null
  nameDeal: string
  nameObject: string
  type: "PROJECT" | "RETAIL"
  mainManager: {
    username: string
    position: string
  } | null
}

export type FoundCompanySuggestion = {
  projects: CompanySuggestionItem[]
  retails: CompanySuggestionItem[]
} | null

interface FindOrgVariables {
  value: string
  searchType: "inn" | "orgName"
}

export function useFindOrganization() {
  // Передаем дженерик типы: <ТипОтвета, Ошибка, ТипПеременныхMutate>
  return useMutation<FoundCompanySuggestion | null, Error, FindOrgVariables>({
    mutationFn: async (variables: FindOrgVariables) => {
      const dataTrim = variables.value.trim()
      const currentType = variables.searchType

      if (currentType === "inn" && dataTrim.length !== 10 && dataTrim.length !== 12) {
        toast.error("Некорректный ИНН, должен быть 10 или 12 символов")
        return null
      }

      if (currentType === "orgName" && dataTrim.length < 2) {
        toast.error("Некорректное название организации, должно быть не менее 2 символов")
        return null
      }

      const response = await getOrganizationByQueryAction(dataTrim, currentType)

      if (!response.success) {
        toast.error(response.error || "Ошибка загрузки")
        throw new Error(response.error || "Error")
      }

      return response.data
    },
    onSuccess: () => {},
    onError: (error: Error) => {
      handleErrorSession(error)
    },
  })
}
