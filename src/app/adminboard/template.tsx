import { redirect } from "next/navigation"
import { getUserFromCookie } from "@/shared/lib/auth/getUserFromCookie"

const TemplateDashboard = async ({ children }: { children: React.ReactNode }) => {
  try {
    const user = await getUserFromCookie()

    if (!user) redirect("/login")

    if (user.role !== "ADMIN") {
      redirect("/forbidden")
    }

    return <>{children}</>
  } catch (_error) {
    redirect("/login")
  }
}

export default TemplateDashboard
