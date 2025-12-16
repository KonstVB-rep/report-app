import { checkTokens } from "../lib/helpers/checkTokens"
import type { UserWithoutPassword } from "../types"

const handleMutationWithAuthCheck = async <T, U>(
  mutateFn: (data: T) => Promise<U>,
  data: T,
  authUser: UserWithoutPassword | null,
  isSubmittingRef: { current: boolean },
): Promise<U> => {
  // 1. Проверка на "двойной клик"
  if (isSubmittingRef.current) {
    throw new Error("Операция уже выполняется")
  }

  isSubmittingRef.current = true

  try {
    if (!authUser?.id) {
      const error = new Error("Сессия истекла") as Error & { status?: number }
      error.status = 401
      throw error
    }

    await checkTokens()

    const result = await mutateFn(data)
    return result
  } catch (error) {
    console.error("Error in mutation wrapper:", error)
    throw new Error("Не удалось выполнить операцию")
  } finally {
    isSubmittingRef.current = false
  }
}

export default handleMutationWithAuthCheck
