import { format } from "date-fns"
import { ru } from "date-fns/locale"
import {
  LABEL_TASK_PRIORITY,
  LABEL_TASK_STATUS,
  TASK_PRIORITY_COLOR_BORDER,
} from "@/feature/task/model/constants"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader } from "@/shared/components/ui/card"
import { cleanDistance } from "../lib/helpers"
import type { TaskWithUserInfo } from "../types"

const TaskCard = ({ data }: { data: TaskWithUserInfo }) => {
  if (!data) return null

  const duedate = cleanDistance(new Date(data.dueDate))

  const formattedDueDate = format(data.dueDate, "d MMMM yyyy HH:mm", {
    locale: ru,
  })
  const formattedCreated = format(data.createdAt, "d MMMM yyyy HH:mm", {
    locale: ru,
  })

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-3">
        <Badge className="text-lg p-3 flex gap-3" variant="outline">
          Статус: {LABEL_TASK_STATUS[data.taskStatus]}
        </Badge>
        <Badge
          className={`text-lg p-3 flex gap-3 ${TASK_PRIORITY_COLOR_BORDER[data.taskPriority]}`}
          variant="outline"
        >
          Приоритет: {LABEL_TASK_PRIORITY[data.taskPriority]}
        </Badge>
      </div>
      <Card
        className={`relative p-0 pb-3 grid gap-3 cursor-pointer drop-shadow-xl w-full border-4 ${TASK_PRIORITY_COLOR_BORDER[data.taskPriority]}`}
      >
        <CardHeader className="pt-3 text-lg px-3 py-2 rounded-lg overflow-hidden wrap-break-word">
          Наименование: {data.title}
        </CardHeader>
        <CardDescription className="px-3 py-0 text-lg">
          Описание: {data.description}
        </CardDescription>
        <CardFooter className="grid gap-3 px-3 py-0">
          <div className="grid gap-1 flex-1">
            <span className="capitalize text-md">автор:</span>
            <Badge className="text-lg capitalize">{data.assigner?.username ?? "Удален"}</Badge>
          </div>

          <div className="grid gap-1 flex-1">
            <span className="capitalize text-md">исполнитель:</span>
            <Badge className="text-lg capitalize">{data.executor?.username ?? "Не назначен"}</Badge>
          </div>
          <div className="text-md text-gray-500 w-full">
            <span className="capitalize">Создана:</span> {formattedCreated}
          </div>
          <div className="text-md text-primary w-full">
            <span className="capitalize">Срок:</span> {duedate} - {formattedDueDate}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default TaskCard
