"use client"

import dynamic from "next/dynamic"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import LoadingView from "@/entities/task/ui/LoadingView"
import { useGetTasksDepartment } from "@/feature/task/hooks/query"
import { viewType } from "@/feature/task/model/constants"
import type { ViewType } from "@/feature/task/types"
import СreateTaskDialog from "@/feature/task/ui/Modals/СreateTaskDialog"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import ButtonRefresh from "@/shared/custom-components/ui/Buttons/ButtonRefresh"
import { LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"
import useViewType from "@/shared/hooks/useViewType"
import { PERMISSIONS } from "@/shared/lib/constants"

const Kanban = dynamic(() => import("@/widgets/task/ui/Kanban"), {
  ssr: false,
  loading: () => <LoadingView />,
})

const TaskTable = dynamic(() => import("@/widgets/task/ui/TaskTable"), {
  ssr: false,
  loading: () => <LoadingView />,
})

const TasksPageMain = (params: { departmentId: string }) => {
  const departmentId = Number(params.departmentId)

  const authUser = useRequireAuth()

  const hasAccess = hasAccessToDataSummary(authUser, PERMISSIONS.TASK_MANAGEMENT)

  const { data, isPending, refetch } = useGetTasksDepartment()

  const { handleViewChange, currentView } = useViewType<ViewType>("table", ["table", "kanban"])

  if (!hasAccess) {
    return <RedirectToPath to={`/dashboard/tasks/${departmentId}/${authUser.id}`} />
  }

  if (isPending) {
    return <LoaderCircleInWater />
  }

  return (
    <section className="p-5">
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl py-2">Все задачи</h1>
        <ButtonRefresh refetch={refetch} />
      </div>

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
        {currentView === "table" && data && <TaskTable data={data} key="table" />}

        {currentView === "kanban" && data && <Kanban data={data} key="kanban" />}
      </MotionDivY>
    </section>
  )
}

export default TasksPageMain
