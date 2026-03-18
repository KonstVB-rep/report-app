"use client"

import type React from "react"
import { memo } from "react"
import type { PermissionEnum } from "@prisma/client"
import { usePermissions } from "@/app/provider/permission-provider"
import { LoaderCircle } from "../../Loaders"

type ProtectedProps = {
  permission: PermissionEnum
  children: React.ReactNode
  defaultNode?: React.ReactNode
  loadingNode?: React.ReactNode
  allowAdmin?: boolean
}

const ProtectedByPermissions = memo(
  ({ children, permission, defaultNode, loadingNode, allowAdmin = true }: ProtectedProps) => {
    const { permissions, isLoading, role } = usePermissions()

    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          {loadingNode !== undefined ? (
            loadingNode
          ) : (
            <LoaderCircle className="h-auto p-2 bg-muted rounded-md" classSpin="h-5 w-5" />
          )}
        </div>
      )
    }

    const hasAdminAccess = allowAdmin && role === "ADMIN"
    const hasPermission = permissions?.includes(permission)

    if (hasAdminAccess || hasPermission) {
      return <>{children}</>
    }
    return <>{defaultNode ?? null}</>
  },
)

ProtectedByPermissions.displayName = "ProtectedByPermissions"
export default ProtectedByPermissions
