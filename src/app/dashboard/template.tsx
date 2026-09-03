import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getUserFromCookie } from "@/shared/lib/auth/getUserFromCookie"

const TemplateDashboard = async ({ children }: { children: ReactNode }) => {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/login")
  }

  return <>{children}</>
}

export default TemplateDashboard
