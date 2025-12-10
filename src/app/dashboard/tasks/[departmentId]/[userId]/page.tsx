"use client"

import { Activity, Suspense } from "react"
import { PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData"
import LoadingView from "@/entities/task/ui/LoadingView"
import useStoreUser from "@/entities/user/store/useStoreUser"
import CalendarBotLink from "@/feature/calendar/ui/CalendarBotLink"
import { useGetUserTasks } from "@/feature/task/hooks/query"
import { viewType } from "@/feature/task/model/constants"
import type { ViewType } from "@/feature/task/types"
import СreateTaskDialog from "@/feature/task/ui/Modals/СreateTaskDialog"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath"
import { pageParamsSchemaDepsIsUserId, useTypedParams } from "@/shared/hooks/useTypedParams"
import useViewType from "@/shared/hooks/useViewType"

const Kanban = dynamic(() => import("@/widgets/task/ui/Kanban"), {
  ssr: false,
  loading: () => <LoadingView />,
})

const TaskTable = dynamic(() => import("@/widgets/task/ui/TaskTable"), {
  ssr: false,
  loading: () => <LoadingView />,
})

const UserTasksPage = () => {
  const { authUser } = useStoreUser()

  const { userId, departmentId } = useTypedParams(pageParamsSchemaDepsIsUserId)

  const hasAccess = hasAccessToData(userId, PermissionEnum.TASK_MANAGEMENT)

  const { data } = useGetUserTasks()

  const { handleViewChange, currentView } = useViewType<ViewType>("table", ["table", "kanban"])

  if (!authUser) return

  if (!hasAccess) return <RedirectToPath to={`/tasks/${departmentId}/${authUser.id}`} />

  return (
    <section className="p-5">
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl py-2 uppercase">Мои задачи</h1>
        <CalendarBotLink botName="ertel_report_app_task_bot" />
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

export default UserTasksPage
