// src/features/find-organization-by-inn/api/useFindOrganization.ts
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import handleErrorSession from "@/shared/auth/handleErrorSession"
import { getOrganizationByQueryAction } from "../actions/getOrganizationByQueryAction"
import type { SearchType } from "../model/schema"

export type AdditionalContactItem = {
  id: string
  name: string
  phone: string | null
  email: string | null
  position: string | null
}

export type CompanySuggestionItem = {
  id: string
  inn: string | null
  userId: string | null
  nameDeal: string
  nameObject: string
  type: "PROJECT" | "RETAIL"
  phone: string | null
  email: string | null
  contact: string
  additionalContacts: AdditionalContactItem[]
  comments: string | null
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
  searchType: SearchType
}

export function useFindOrganization() {
  return useMutation<FoundCompanySuggestion | null, Error, FindOrgVariables>({
    mutationFn: async (variables: FindOrgVariables) => {
      const response = await getOrganizationByQueryAction(
        variables.value.trim(),
        variables.searchType,
      )

      if (!response.success) {
        toast.error(response.error || "Ошибка загрузки")
        throw new Error(response.error || "Error")
      }

      return response.data
    },
    onError: (error: Error) => {
      handleErrorSession(error)
    },
  })
}
