"use client"

import { Activity, Suspense } from "react"
import { PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import LoadingView from "@/entities/task/ui/LoadingView"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { useGetTasksDepartment } from "@/feature/task/hooks/query"
import { viewType } from "@/feature/task/model/constants"
import type { ViewType } from "@/feature/task/types"
import СreateTaskDialog from "@/feature/task/ui/Modals/СreateTaskDialog"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import { LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath"
import { pageParamsSchemaDepsId, useTypedParams } from "@/shared/hooks/useTypedParams"
import useViewType from "@/shared/hooks/useViewType"

const Kanban = dynamic(() => import("@/widgets/task/ui/Kanban"), {
  ssr: false,
})

const TaskTable = dynamic(() => import("@/widgets/task/ui/TaskTable"), {
  ssr: false,
})

const TasksPage = () => {
  const { authUser } = useStoreUser()

  const hasAccess = hasAccessToDataSummary(authUser?.id as string, PermissionEnum.TASK_MANAGEMENT)

  const { departmentId } = useTypedParams(pageParamsSchemaDepsId)

  const { data, isPending } = useGetTasksDepartment()

  const { handleViewChange, currentView } = useViewType<ViewType>("table", ["table", "kanban"])

  if (!authUser) return null

  if (!hasAccess) {
    return <RedirectToPath to={`/dashboard/tasks/${departmentId}/${authUser.id}`} />
  }

  if (isPending) {
    return <LoaderCircleInWater />
  }

  return (
    <section className="p-5">
      <h1 className="text-xl py-2">Все задачи</h1>

      <Separator />

      <div className="p-2 flex flex-wrap-reverse justify-between gap-2">
        <div className="flex gap-2">
          {viewType.map((item) => {
            return (
              <Button key={item.id} onClick={() => handleViewChange(item.id)} variant="outline">
                {item.value}
              </Button>
            )
          })}
        </div>

        <СreateTaskDialog />
      </div>

      <MotionDivY className="flex-1">
        <Activity mode={currentView === "table" ? "visible" : "hidden"}>
          <Suspense fallback={<LoadingView />}>{data && <TaskTable data={data} />}</Suspense>
        </Activity>
        <Activity mode={currentView === "kanban" ? "visible" : "hidden"}>
          <Suspense fallback={<LoadingView />}>{data && <Kanban data={data} />}</Suspense>
        </Activity>
      </MotionDivY>
    </section>
  )
}

export default TasksPage
