"use client"

import type { ReactNode } from "react"
import ProtectedTemplate from "@/shared/custom-components/ui/Protect/ProtectedTemplate"

const TemplateDashboard = ({ children }: { children: ReactNode }) => {
  return <ProtectedTemplate>{children}</ProtectedTemplate>
}

export default TemplateDashboard
