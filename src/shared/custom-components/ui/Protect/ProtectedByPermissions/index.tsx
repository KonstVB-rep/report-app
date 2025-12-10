"use client"

import { memo, useEffect, useState } from "react"
import type { PermissionEnum } from "@prisma/client"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { checkPermission } from "@/shared/api/checkByServer"
import { LoaderCircle } from "../../Loaders"

type ProtectedProps = {
  permission: PermissionEnum
  children: React.ReactNode
  defaultNode?: React.ReactNode
}

const ProtectedByPermissions = memo(({ children, permission, defaultNode }: ProtectedProps) => {
  const { authUser } = useStoreUser()
  const [loading, setloading] = useState(false)
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    if (!permission) return

    setloading(true)

    checkPermission(permission)
      .then((result) => {
        if (mounted) {
          setHasAccess(result)
        }
      })
      .finally(() => setloading(false))

    return () => {
      mounted = false
    }
  }, [permission])

  if (loading)
    return <LoaderCircle className="h-auto p-2 bg-muted rounded-md" classSpin="h-5 w-5" />

  if (hasAccess === null) return null

  if (!authUser) return defaultNode ?? null

  return hasAccess ? children : (defaultNode ?? null)
})

ProtectedByPermissions.displayName = "ProtectedByPermissions"

export default ProtectedByPermissions
