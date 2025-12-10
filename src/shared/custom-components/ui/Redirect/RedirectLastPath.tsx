"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { resetAllStores } from "../../../lib/helpers/сreate"

const RedirectLastPath = ({ children }: { children: ReactNode }) => {
  const { isAuth, authUser } = useStoreUser()
  const router = useRouter()
  const hasRedirectedRef = useRef(false)

  console.log("isAuth", isAuth)
  console.log("authUser", authUser)

  useEffect(() => {
    if (!isAuth || !authUser) return
    // Если пользователь авторизован, редиректим
    if (isAuth && authUser && !hasRedirectedRef.current) {
      const lastAppPath = localStorage.getItem("lastAppPath")
      const redirectUrl = lastAppPath || "/dashboard"
      hasRedirectedRef.current = true
      router.push(redirectUrl)
    }

    // Сбрасываем флаг при разлогине
    if (!isAuth) {
      hasRedirectedRef.current = false
      resetAllStores()
    }
  }, [isAuth, authUser, router])

  return <>{children}</>
}

export default RedirectLastPath
