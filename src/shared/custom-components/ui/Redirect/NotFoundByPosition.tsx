"use client"

import { type ReactNode, useEffect, useState } from "react"
import NotFound from "@/app/not-found"
import { NOT_MANAGERS_POSITIONS_VALUES } from "@/entities/department/lib/constants"
import useStoreDepartment from "@/entities/department/store/useStoreDepartment"
import { pageParamsSchemaDepsIsUserId, useTypedParams } from "@/shared/hooks/useTypedParams"
import { useParams } from "next/navigation"

const NotFoundByPosition = ({ children }: { children: ReactNode }) => {
  // const { userId, departmentId } = useTypedParams(pageParamsSchemaDepsIsUserId)

  const { userId, departmentId } = useParams<{
    userId: string
    departmentId: string
  }>()

  const departmentIdNumber = Number(departmentId)
  const { departments } = useStoreDepartment()

  const [isManager, setIsManager] = useState<boolean>(true)

  useEffect(() => {
    if (departmentIdNumber) {
      const deps = departments?.find((dep) => dep.id === departmentIdNumber)
      const position = deps?.users.find((user) => user.id === userId)?.position
      if (position) {
        setIsManager(!NOT_MANAGERS_POSITIONS_VALUES.includes(position))
      }
    }
  }, [departmentIdNumber, departments, userId])

  if (!userId || !departmentIdNumber || !isManager) {
    return <NotFound />
  }

  return <>{children}</>
}

export default NotFoundByPosition
