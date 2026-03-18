"use client"

import useStoreUser, { type AuthUserType } from "@/entities/user/store/useStoreUser"

export const useRequireAuth = () => {
  const authUser = useStoreUser((state) => state.authUser)
  return authUser as AuthUserType
}
