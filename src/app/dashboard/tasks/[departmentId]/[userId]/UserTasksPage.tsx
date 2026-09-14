"use client"

import { Activity, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { hasAccessToDataPage } from "@/entities/deal/lib/hasAccessToData"
import LoadingView from "@/entities/task/ui/LoadingView"
import { useGetUserTasks } from "@/feature/task/hooks/query"
import { viewType } from "@/feature/task/model/constants"
import type { ViewType } from "@/feature/task/types"
import СreateTaskDialog from "@/feature/task/ui/Modals/СreateTaskDialog"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import ButtonRefresh from "@/shared/custom-components/ui/Buttons/ButtonRefresh"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
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

interface UserTasksPageProps {
  departmentId: string
  userId: string
}

const UserTasksPage = ({ departmentId, userId }: UserTasksPageProps) => {
  const authUser = useRequireAuth()
  const router = useRouter()

  const { data, isLoading, refetch } = useGetUserTasks({ userId })

  const { handleViewChange, currentView } = useViewType<ViewType>("table", ["table", "kanban"])

  const hasAccess = authUser
    ? hasAccessToDataPage(authUser, userId, PERMISSIONS.TASK_MANAGEMENT)
    : false

  useEffect(() => {
    if (authUser && !hasAccess) {
      router.replace(`/dashboard/tasks/${departmentId}/${authUser.id}`)
    }
  }, [authUser, hasAccess, router, departmentId])

  if (!authUser || !hasAccess || isLoading) return <LoadingView />

  return (
    <section className="p-5">
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl py-2 uppercase">Мои задачи</h1>
        <ButtonRefresh refetch={refetch} />
      </div>

      <Separator />

      <div className="p-2 flex flex-wrap-reverse justify-between gap-2">
        <div className="flex gap-2">
          {viewType.map((item) => (
            <Button key={item.id} onClick={() => handleViewChange(item.id)} variant="outline">
              {item.value}
            </Button>
          ))}
        </div>
        <СreateTaskDialog />
      </div>

      <MotionDivY className="flex-1">
        <Activity mode={currentView === "table" ? "visible" : "hidden"}>
          {data && <TaskTable data={data} key="table" />}
        </Activity>
        <Activity mode={currentView === "kanban" ? "visible" : "hidden"}>
          {data && <Kanban data={data} key="kanban" />}
        </Activity>
      </MotionDivY>
    </section>
  )
}

export default UserTasksPage
