"use client"

import { PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { useGetTask } from "@/feature/task/hooks/query"
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath"
import Loading from "./Loading"

const TaskCard = dynamic(() => import("@/entities/task/ui/TaskCard"), {
  loading: () => <Loading />,
  ssr: false,
})

const TaskDetails = ({ taskId, departmentId }: { taskId: string; departmentId: number }) => {
  const { authUser } = useStoreUser()

  const { data, isPending } = useGetTask(taskId)

  if (!authUser) {
    return <RedirectToPath to="/login" />
  }

  const hasAccess = hasAccessToData(authUser?.id, PermissionEnum.TASK_MANAGEMENT)

  if (!hasAccess) {
    return <RedirectToPath to={`/tasks/${departmentId}/${authUser?.id}`} />
  }

  if (isPending) return <Loading />
  if (!data) return <h1 className="p-5 pt-20 text-2xl text-center">Задача не найдена</h1>

  return (
    <div className="p-5">
      <TaskCard task={data} />
    </div>
  )
}

export default TaskDetails
