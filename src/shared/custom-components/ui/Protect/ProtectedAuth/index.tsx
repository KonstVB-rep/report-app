"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import useStoreUser from "@/entities/user/store/useStoreUser"
import ExitAppScreen from "@/shared/custom-components/ui/ExitAppScreen"
import PageTransitionY from "@/shared/custom-components/ui/MotionComponents/PageTransitionY"

// Динамический redirect, чтобы не ломать рендер
const RedirectToPath = dynamic(
  () => import("@/shared/custom-components/ui/Redirect/RedirectToPath"),
  {
    ssr: false,
    // loading: () => <ExitAppScreen />,
  },
)

export default function ProtectedAuth({ children }: { children: React.ReactNode }) {
  const { authUser } = useStoreUser()

  const router = useRouter()

  useEffect(() => {
    if (!authUser) {
      setTimeout(() => {
        router.push("/login")
      }, 300)
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
