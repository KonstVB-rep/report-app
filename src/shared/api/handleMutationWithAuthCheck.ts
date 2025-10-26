import { checkTokens } from "../lib/helpers/checkTokens"
import type { UserWithoutPassword } from "../types"

// Общая логика для блокировки отправки и проверки авторизации
const handleMutationWithAuthCheck = async <T, U>(
  mutateFn: (data: T) => Promise<U>,
  data: T,
  authUser: UserWithoutPassword | null,
  isSubmittingRef: React.RefObject<boolean>,
) => {
  if (isSubmittingRef.current) {
    throw new Error("Операция уже выполняется")
  }

  isSubmittingRef.current = true // Блокируем отправку

  if (!authUser?.id) {
    throw new Error("User ID is missing")
  }

  try {
    await checkTokens()

    return await mutateFn(data)
  } catch (error) {
    console.error("Error in mutation:", error)
    throw error
  } finally {
    isSubmittingRef.current = false
  }
}

export default handleMutationWithAuthCheck
