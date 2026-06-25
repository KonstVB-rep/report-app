import { memo, useState } from "react"
import { Role } from "@prisma/client"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import dynamic from "next/dynamic"
import { cleanDistance } from "@/entities/task/lib/helpers"
import type { TaskWithUserInfo } from "@/entities/task/types"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { LABEL_TASK_PRIORITY, TASK_PRIORITY_COLOR_BORDER } from "@/feature/task/model/constants"
import { Badge } from "@/shared/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card"
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog"

const EditTaskDialogButton = dynamic(() => import("@/feature/task/ui/Modals/EditTaskDialogButton"))

const DelTaskDialogButton = dynamic(() => import("@/feature/task/ui/Modals/DelTaskDialogButton"))

type TaskKanbanCardProps = {
  task: TaskWithUserInfo
}

const TaskKanbanCard = memo(({ task }: TaskKanbanCardProps) => {
  const { authUser } = useStoreUser()

  if (!authUser || !task) return null

  const duedate = cleanDistance(new Date(task.dueDate))

  const formattedDueDate = format(task.dueDate, "d MMMM yyyy HH:mm", {
    locale: ru,
  })
  const formattedCreated = format(task.createdAt, "d MMMM yyyy HH:mm", {
    locale: ru,
  })

  const ADMIN_ROLES: Set<Role> = new Set([Role.ADMIN, Role.SUPER_ADMIN])

  const isCanActionTask =
    task.assignerId === authUser.id ||
    task.executorId === authUser.id ||
    ADMIN_ROLES.has(authUser.role)

  return (
    <Card className="relative p-0 pb-3 grid gap-2 drop-shadow-xl group overflow-visible">
      {isCanActionTask && (
        <div className="group-hover:flex hover:flex hidden flex-col absolute top-0.5 right-0.5 gap-2 bg-background p-1 rounded-md border">
          <EditTaskDialogButton data={task} />
          <DelTaskDialogButton data={task} />
        </div>
      )}
      <CardHeader
        className={`pt-3 py-2 border-t-2 ${TASK_PRIORITY_COLOR_BORDER[task.taskPriority]} rounded-lg line-clamp-2`}
      >
        {task.title}
      </CardHeader>
      <DescriptionTask description={task.description} />
      <CardContent className="flex gap-2 px-3 py-0">
        <Badge variant="outline">{LABEL_TASK_PRIORITY[task.taskPriority]}</Badge>
      </CardContent>
      <CardFooter className="grid gap-2 px-3 py-0">
        <div className="flex flex-wrap gap-2">
          <div className="grid gap-1 flex-1">
            <span className="capitalize text-xs">автор:</span>
            <Badge>{task.assigner ? task.assigner.username : "Не назначен"}</Badge>
          </div>
          <div className="grid gap-1 flex-1">
            <span className="capitalize text-xs">исполнитель:</span>
            <Badge>{task.executor ? task.executor.username : "Не назначен"}</Badge>
          </div>
        </div>
        <div className="text-xs text-gray-500 w-full">
          <span className="capitalize">Создана:</span> {formattedCreated}
        </div>
        <div className="text-xs text-primary w-full">
          <span className="capitalize">Срок:</span> {duedate} - {formattedDueDate}
        </div>
      </CardFooter>
    </Card>
  )
})

export default TaskKanbanCard

const DescriptionTask = ({ description }: { description: string }) => {
  const [openDescribe, setOpenDescribe] = useState(false)
  return (
    <>
      <CardDescription
        className="px-3 py-0 line-clamp-2 overflow-hidden wrap-break-word hover:shadow-[0_0_0_1px_#3b82f6] rounded-xs cursor-pointer"
        onClick={() => setOpenDescribe(true)}
        title="Нажми для просмотра"
      >
        {description}
      </CardDescription>

      {openDescribe && (
        <RowInfoDialog closeFn={() => setOpenDescribe(false)} isActive={true} text={description} />
      )}
    </>
  )
}
