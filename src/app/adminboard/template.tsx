"use client"

import ProtectedByRole from "@/shared/custom-components/ui/Protect/ProtectByRole"

const TemplateDashboard = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedByRole>{children}</ProtectedByRole>
}

export default TemplateDashboard
