"use client"

import { memo, useEffect, useState } from "react"
import type { PermissionEnum } from "@prisma/client"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { checkPermission } from "@/shared/api/checkByServer"

type ProtectedProps = {
  permission: PermissionEnum
  children: React.ReactNode
}

const ProtectedByPermissions = memo(({ children, permission }: ProtectedProps) => {
  const { authUser } = useStoreUser()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    if (!permission) return

    checkPermission(permission).then((result) => {
      if (mounted) setHasAccess(result)
    })

    return () => {
      mounted = false
    }
  }, [permission])

  if (!authUser) return null

  return hasAccess ? children : null
})

ProtectedByPermissions.displayName = "ProtectedByPermissions"

export default ProtectedByPermissions
