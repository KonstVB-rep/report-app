"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useStoreUser from "@/entities/user/store/useStoreUser"

export const useRequireAuth = () => {
  const { authUser } = useStoreUser()
  const router = useRouter()

  useEffect(() => {
    if (!authUser) {
      router.replace("/login") // безопасный редирект без мерцания
    }
  }, [authUser, router])

  return authUser
}
