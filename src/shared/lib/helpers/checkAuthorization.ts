import { checkTokens } from "./checkTokens"

export const checkAuthorization = async (authUserId: string | undefined) => {
  if (!authUserId) {
    throw new Error("Пользователь не авторизован")
  }

  await checkTokens()
}
