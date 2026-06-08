import { getUserFromCookie } from "@/shared/lib/auth/getUserFromCookie"

export const requireUser = async () => {
  const user = await getUserFromCookie()

  if (!user) {
    throw new Error("UNAUTHORIZED")
  }

  return user
}
