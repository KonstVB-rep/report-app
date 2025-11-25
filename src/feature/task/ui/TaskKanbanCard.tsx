import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { ExternalLink } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import z from "zod"
import type { DepartmentLabelsById } from "@/entities/department/lib/constants"
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
import { useTypedParams } from "@/shared/hooks/useTypedParams"

const EditTaskDialogButton = dynamic(() => import("@/feature/task/ui/Modals/EditTaskDialogButton"))

const DelTaskDialogButton = dynamic(() => import("@/feature/task/ui/Modals/DelTaskDialogButton"))

type TaskKanbanCardProps = {
  task: TaskWithUserInfo
}

const pageParamsSchema = z.object({
  userId: z.string(),
  departmentId: z.string().transform((value) => {
    return value as keyof typeof DepartmentLabelsById
  }),
})

const TaskKanbanCard = ({ task }: TaskKanbanCardProps) => {
  const { departmentId, userId } = useTypedParams(pageParamsSchema)

  const { authUser } = useStoreUser()

  if (!authUser || !task) return null

  const duedate = cleanDistance(new Date(task.dueDate))

  const formattedDueDate = format(task.dueDate, "d MMMM yyyy HH:mm", {
    locale: ru,
  })
  const formattedCreated = format(task.createdAt, "d MMMM yyyy HH:mm", {
    locale: ru,
  })

  const canEditOrDelete = task.assignerId === authUser.id

  return (
    <Card className="relative p-0 pb-3 grid gap-2 cursor-pointer drop-shadow-xl group">
      <Link
        className="group-hover:grid hidden place-items-center border-primary hover:border-2 absolute inset-0 bg-background/80 rounded-md"
        href={`/dashboard/tasks/${departmentId}/${userId}/${task.id}`}
        prefetch={false}
      >
        <span className="hover:border-primary hover:border-2 p-2 rounded-md bg-background flex gap-2">
          Перейти к задаче
          <ExternalLink />
        </span>
      </Link>
      {canEditOrDelete && (
        <div className="group-hover:flex hidden flex-col absolute top-[2px] right-[2px] gap-2 bg-background p-1 rounded-md border">
          <EditTaskDialogButton id={task.id} />
          <DelTaskDialogButton id={task.id} />
        </div>
      )}
      <CardHeader
        className={`pt-3 py-2 border-t-2 ${TASK_PRIORITY_COLOR_BORDER[task.taskPriority]} rounded-lg line-clamp-2`}
      >
        {task.title}
      </CardHeader>
      <CardDescription className="px-3 py-0 line-clamp-2">{task.description}</CardDescription>
      <CardContent className="flex gap-2 px-3 py-0">
        <Badge variant="outline">{LABEL_TASK_PRIORITY[task.taskPriority]}</Badge>
      </CardContent>
      <CardFooter className="grid gap-2 px-3 py-0">
        <div className="flex flex-wrap gap-2">
          <div className="grid gap-1 flex-1">
            <span className="capitalize text-xs">автор:</span>
            <Badge>{task.assigner.username}</Badge>
          </div>
          <div className="grid gap-1 flex-1">
            <span className="capitalize text-xs">исполнитель:</span>
            <Badge>{task.executor.username}</Badge>
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
}

export default TaskKanbanCard
