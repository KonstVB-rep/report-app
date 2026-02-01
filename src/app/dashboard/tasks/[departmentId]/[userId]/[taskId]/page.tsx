"use client"

import { PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData"
import { useGetTask } from "@/feature/task/hooks/query"
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"
import Loading from "./loading"

const TaskCard = dynamic(() => import("@/entities/task/ui/TaskCard"), {
  loading: () => <Loading />,
  ssr: false,
})

const TaskPage = async () => {
  const authUser = useRequireAuth()

  const { userId, departmentId, taskId } = useParams<{
    userId: string
    departmentId: string
    taskId: string
  }>()

  const { data, isPending } = useGetTask(taskId)

  const hasAccess = hasAccessToData(userId, PermissionEnum.TASK_MANAGEMENT)

  if (!hasAccess) {
    return <RedirectToPath to={`/tasks/${departmentId}/${authUser.id}`} />
  }

  if (isPending) return <Loading />
  if (!data) return <h1 className="p-5 pt-20 text-2xl text-center">Задача не найдена</h1>

  return (
    <div className="p-5">
      <TaskCard data={data} />
    </div>
  )
}

export default TaskPage
