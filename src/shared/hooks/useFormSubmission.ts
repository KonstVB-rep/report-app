import { useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import useStoreUser from "@/entities/user/store/useStoreUser"

export const useFormSubmission = () => {
  const queryClient = useQueryClient()
  const { authUser } = useStoreUser()
  const isSubmittingRef = useRef(false) // Состояние для блокировки отправки формы

  return { queryClient, authUser, isSubmittingRef }
}
