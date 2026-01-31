"use client"

import { PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { useGetTask } from "@/feature/task/hooks/query"
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath"
import Loading from "./loading"

const TaskCard = dynamic(() => import("@/entities/task/ui/TaskCard"), {
  loading: () => <Loading />,
  ssr: false,
})

const TaskPage = async () => {
  const { authUser } = useStoreUser()

  const { userId, departmentId, taskId } = useParams<{
    userId: string
    departmentId: string
    taskId: string
  }>()

  const departmentIdNumber = Number(departmentId)

  const { data, isPending } = useGetTask(taskId)

  const hasAccess = hasAccessToData(userId, PermissionEnum.TASK_MANAGEMENT)

  console.log(departmentIdNumber, userId, taskId, "TaskPage")

  if (!hasAccess) {
    return <RedirectToPath to={`/tasks/${departmentIdNumber}/${authUser?.id}`} />
  }

  if (isPending) return <Loading />
  if (!data) return <h1 className="p-5 pt-20 text-2xl text-center">Задача не найдена</h1>

  return (
    <div className="p-5">
      <TaskCard task={data} />
    </div>
  )
}

export default TaskPage
