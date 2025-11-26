"use client"

import ProtectedTemplate from "@/shared/custom-components/ui/Protect/ProtectedTemplate"

const TemplateDashboard = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedTemplate>{children}</ProtectedTemplate>
}

export default TemplateDashboard
