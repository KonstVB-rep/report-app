"use client"

import { use } from "react"
import { PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import z from "zod"
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData"
import type { DepartmentsUnionIds } from "@/entities/department/types"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { useGetTask } from "@/feature/task/hooks/query"
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import Loading from "./loading"
import { useParams } from "next/navigation"

const TaskCard = dynamic(() => import("@/entities/task/ui/TaskCard"), {
  loading: () => <Loading />,
  ssr: false,
})

const pageParamsSchema = z.object({
  taskId: z.string(),
  userId: z.string(),
  departmentId: z.coerce
    .number()
    .positive()
    .transform((value) => {
      return value as DepartmentsUnionIds
    }),
})

const TaskPage = async () => {
  const { authUser } = useStoreUser()

  // const { taskId, userId, departmentId } = useTypedParams(pageParamsSchema)

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
