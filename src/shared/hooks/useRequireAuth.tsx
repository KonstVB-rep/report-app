"use client"

import useStoreUser from "@/entities/user/store/useStoreUser"

export const useRequireAuth = () => {
  const authUser = useStoreUser((state) => state.authUser)

  if (!authUser) {
    throw new Error("useAuth must be used within a protected route where authUser is guaranteed.")
  }

  return authUser
}
