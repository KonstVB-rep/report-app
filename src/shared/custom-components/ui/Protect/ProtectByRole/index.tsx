"use client"

import { usePermissions } from "@/app/provider/permission-provider"

interface ProtectedByRoleProps {
  children: React.ReactNode
  role?: string
}

export const ProtectedByRole = ({ children, role = "ADMIN" }: ProtectedByRoleProps) => {
  const { role: userRole } = usePermissions()

  if (userRole !== role) return null

  return <>{children}</>
}
