import { useEffect, useState } from "react"
import { checkDepartment } from "@/shared/api/checkByServer"
import { pageParamsSchemaDepsId, useTypedParams } from "@/shared/hooks/useTypedParams"

const ProtectedByDepartmentAffiliation = ({ children }: React.PropsWithChildren) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setloading] = useState(false)
  const { departmentId } = useTypedParams(pageParamsSchemaDepsId)

  useEffect(() => {
    let mounted = true
    if (!departmentId) return
    setloading(true)

    checkDepartment(departmentId)
      .then((result) => {
        if (mounted) setHasAccess(result)
      })
      .finally(() => setloading(false))

    return () => {
      mounted = false
    }
  }, [departmentId])
  if (loading) return <div className="w-auto h-auot animate-pulse rounded-md bg-muted" />

  return hasAccess ? children : null
}

export default ProtectedByDepartmentAffiliation
