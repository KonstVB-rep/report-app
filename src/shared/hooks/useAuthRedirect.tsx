import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import useStoreUser, { selectAuthUser, selectIsAuth } from "@/entities/user/store/useStoreUser"

const isValidAppPath = (path: string | null): path is string => {
  if (!path || typeof path !== "string") return false
  if (path.startsWith("http") || path.startsWith("/login") || path.startsWith("/auth")) {
    return false
  }
  return path.startsWith("/")
}

export const useAuthRedirect = () => {
  const isAuth = useStoreUser(selectIsAuth)
  const authUser = useStoreUser(selectAuthUser)
  const router = useRouter()
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    if (isAuth && authUser && !hasRedirectedRef.current) {
      const lastAppPath = typeof window !== "undefined" ? localStorage.getItem("lastAppPath") : null
      const redirectUrl = isValidAppPath(lastAppPath) ? lastAppPath : "/dashboard"

      hasRedirectedRef.current = true
      router.replace(redirectUrl)

      try {
        router.replace(redirectUrl)
      } catch (error) {
        console.error("Failed to redirect:", error)
        hasRedirectedRef.current = false
      }
    }

    if (!isAuth) {
      hasRedirectedRef.current = false
    }
  }, [isAuth, authUser, router])
}
