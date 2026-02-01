"use client"

import { PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData"
import type { TaskWithUserInfo } from "@/entities/task/types"
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"
import Loading from "./Loading"

const TaskCard = dynamic(() => import("@/entities/task/ui/TaskCard"), {
  loading: () => <Loading />,
  ssr: false,
})

const TaskDetails = ({ departmentId }: { departmentId: number }) => {
  const authUser = useRequireAuth()

  const { selectedDataItem } = useTableContext<TaskWithUserInfo>()
  if (!selectedDataItem) return null

  if (!selectedDataItem) return null

  const hasAccess = hasAccessToData(authUser?.id, PermissionEnum.TASK_MANAGEMENT)

  if (!hasAccess) {
    return <RedirectToPath to={`/tasks/${departmentId}/${authUser?.id}`} />
  }

  return (
    <div className="p-5">
      <TaskCard data={selectedDataItem} />
    </div>
  )
}

export default TaskDetails
