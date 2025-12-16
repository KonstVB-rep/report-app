"use client"

import type { ReactNode } from "react"
import ProtectedAuth from "@/shared/custom-components/ui/Protect/ProtectedAuth"

const TemplateDashboard = ({ children }: { children: ReactNode }) => {
  return <ProtectedAuth>{children}</ProtectedAuth>
}

export default TemplateDashboard
