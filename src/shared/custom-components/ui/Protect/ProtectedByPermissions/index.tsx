"use client"

import { memo, useEffect, useState } from "react"
import type { PermissionEnum } from "@prisma/client"
import { checkPermission } from "@/shared/api/checkByServer"
import { LoaderCircle } from "../../Loaders"

type ProtectedProps = {
  permission: PermissionEnum
  children: React.ReactNode
  defaultNode?: React.ReactNode
}

const ProtectedByPermissions = memo(({ children, permission, defaultNode }: ProtectedProps) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    if (!permission) return

    checkPermission(permission).then((result) => {
      if (mounted) {
        setHasAccess(result)
      }
    })

    return () => {
      mounted = false
    }
  }, [permission])

  if (hasAccess === null) {
    return <LoaderCircle className="h-auto p-2 bg-muted rounded-md" classSpin="h-5 w-5" />
  }

  if (hasAccess === true) {
    return <>{children}</>
  }

  return defaultNode ?? null
})

ProtectedByPermissions.displayName = "ProtectedByPermissions"

export default ProtectedByPermissions
