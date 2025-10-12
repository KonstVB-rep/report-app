"use client"

import { type ReactNode, useEffect, useState } from "react"
import NotFound from "@/app/not-found"
import { NOT_MANAGERS_POSITIONS_VALUES } from "@/entities/department/lib/constants"
import useStoreDepartment from "@/entities/department/store/useStoreDepartment"
import { pageParamsSchemaDepsIsUserId, useTypedParams } from "@/shared/hooks/useTypedParams"

const NotFoundByPosition = ({ children }: { children: ReactNode }) => {
  const { userId, departmentId } = useTypedParams(pageParamsSchemaDepsIsUserId)
  const { departments } = useStoreDepartment()

  const [isManager, setIsManager] = useState<boolean>(true)

  useEffect(() => {
    if (departmentId) {
      const deps = departments?.find((dep) => dep.id === departmentId)
      const position = deps?.users.find((user) => user.id === userId)?.position
      if (position) {
        setIsManager(!NOT_MANAGERS_POSITIONS_VALUES.includes(position))
      }
    }
  }, [departmentId, departments, userId])

  if (!userId || !departmentId || !isManager) {
    return <NotFound />
  }

  return <>{children}</>
}

export default NotFoundByPosition
