import type { PropsWithChildren } from "react"
import { TooltipProvider } from "@/shared/components/ui/tooltip"
import AdminClientLayout from "./ui/AdminClientLayout"

export const instant = false

const AdminboardLayout = async ({ children }: PropsWithChildren) => {
  return (
    <AdminClientLayout>
      <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
    </AdminClientLayout>
  )
}

export default AdminboardLayout
