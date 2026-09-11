import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import ClientProvidersWrapper from "@/shared/custom-components/ui/ClientProvidersWrapper"
import { getUserFromCookie } from "@/shared/lib/auth/getUserFromCookie"

const TemplateDashboard = async ({ children }: { children: ReactNode }) => {
  await connection()
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/login")
  }

  return <ClientProvidersWrapper>{children}</ClientProvidersWrapper>
}

export default TemplateDashboard
