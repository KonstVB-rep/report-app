import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useStoreUser, { type AuthUserType } from "@/entities/user/store/useStoreUser"

export const useRequireAuth = (): {
  authUser: AuthUserType | null | undefined
  loading: boolean
} => {
  const { authUser } = useStoreUser() // AuthUserType | null | undefined
  const router = useRouter()

  useEffect(() => {
    if (authUser === null) {
      router.replace("/login")
    }
  }, [authUser, router])

  if (authUser === undefined) return { authUser: undefined, loading: true }

  if (authUser === null) return { authUser: null, loading: true }

  return { authUser, loading: false }
}
