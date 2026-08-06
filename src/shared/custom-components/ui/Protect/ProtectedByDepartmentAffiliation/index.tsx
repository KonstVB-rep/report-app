"use client"
import { useParams } from "next/navigation"
import NotFound from "@/app/not-found"
import { usePermissions } from "@/app/provider/permission-provider"

const ProtectedByDepartmentAffiliation = ({ children }: React.PropsWithChildren) => {
  const { departmentId: departmentContext, isLoading } = usePermissions()

  const { departmentId } = useParams<{
    departmentId: string
  }>()

  const departmentIdNumber = Number(departmentId)

  const hasAccessToDepartment = departmentContext === departmentIdNumber
  if (isLoading) return <div className="w-auto h-auot animate-pulse rounded-md bg-muted" />

  return hasAccessToDepartment ? children : <NotFound />
}

export default ProtectedByDepartmentAffiliation
