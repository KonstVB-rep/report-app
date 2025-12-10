"use client"

import useStoreUser from "@/entities/user/store/useStoreUser"
import ExitAppScreen from "@/shared/custom-components/ui/ExitAppScreen"
import PageTransitionY from "@/shared/custom-components/ui/MotionComponents/PageTransitionY"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Динамический redirect, чтобы не ломать рендер
const RedirectToPath = dynamic(
  () => import("@/shared/custom-components/ui/Redirect/RedirectToPath"),
  {
    ssr: false,
    // loading: () => <ExitAppScreen />,
  },
)

export default function ProtectedTemplate({ children }: { children: React.ReactNode }) {
  const { authUser } = useStoreUser()
  console.log("authUser", authUser)
  const router = useRouter()

  useEffect(() => {
    if (!authUser) {
      setTimeout(() => {
        router.push("/login")
      }, 500)
    }
  }, [authUser, router])

  if (!authUser) {
    return (
      <>
        <ExitAppScreen />
        <RedirectToPath to="/login" />
      </>
    )
  }

  return <PageTransitionY>{children}</PageTransitionY>
}
