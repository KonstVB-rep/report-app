import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { checkDepartment } from "@/shared/api/checkByServer"

const ProtectedByDepartmentAffiliation = ({ children }: React.PropsWithChildren) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setloading] = useState(false)

  const { departmentId } = useParams<{
    departmentId: string
  }>()

  const departmentIdNumber = Number(departmentId)

  useEffect(() => {
    let mounted = true
    if (!departmentIdNumber) return
    setloading(true)

    checkDepartment(departmentIdNumber)
      .then((result) => {
        if (mounted) setHasAccess(result)
      })
      .finally(() => setloading(false))

    return () => {
      mounted = false
    }
  }, [departmentIdNumber])
  if (loading) return <div className="w-auto h-auot animate-pulse rounded-md bg-muted" />

  return hasAccess ? children : null
}

export default ProtectedByDepartmentAffiliation
