"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getUserPermissions } from "@/shared/api/getUserPermissions"
import type { PERMISSIONS_UNION } from "@/shared/lib/constants"

type PermissionContextType = {
  permissions: PERMISSIONS_UNION[] | null
  role: string | null
  isLoading: boolean
  departmentId: number | null
}

const PermissionContext = createContext<PermissionContextType>({
  permissions: null,
  isLoading: true,
  role: null,
  departmentId: null,
})

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [permissions, setPermissions] = useState<PERMISSIONS_UNION[] | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [departmentId, setDepartmentId] = useState<number | null>(null)

  useEffect(() => {
    getUserPermissions()
      .then((data) => {
        setPermissions(data.permissions)
        setRole(data.role)
        setDepartmentId(data.departmentId ?? null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <PermissionContext.Provider value={{ permissions, role, isLoading, departmentId }}>
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermissions = () => {
  const context = useContext(PermissionContext)

  if (context === undefined) {
    throw new Error("useUserContext was used outside of its Provider")
  }

  return context
}
