import type { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TaskPriority, TaskStatus } from "@prisma/client"
import { type Resolver, useForm } from "react-hook-form"
import { addCorrectTimeInDates, formatDate } from "@/entities/task/lib/helpers"
import type { TaskWithUserInfo } from "@/entities/task/types"
import { TaskFormSchemaUpdate, type TaskSchemaUpdate } from "@/feature/task/model/schema"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useUpdateTask } from "../../hooks/mutate"
import TaskForm from "./TaskForm"

type EditTaskFormProps = {
  close: Dispatch<SetStateAction<void>>
  data: TaskWithUserInfo
}

const EditTaskForm = ({ close, data }: EditTaskFormProps) => {
  console.log(data, "data")
  const form = useForm<TaskSchemaUpdate>({
    resolver: zodResolver(TaskFormSchemaUpdate) as Resolver<TaskSchemaUpdate>,
    defaultValues: {
      title: data.title,
      description: data.description,
      taskStatus: data.taskStatus as TaskStatus,
      taskPriority: data.taskPriority as TaskPriority,
      executorId: data.executorId ?? "Не назначен",
      dueDate: new Date(data.dueDate.toISOString()),
      startDate: new Date(data.startDate.toISOString()),
      startTime: new Date(data.startDate).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      endTime: new Date(data?.dueDate).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    },
  })

  const { mutateAsync, isPending } = useUpdateTask()

  const onSubmit = (updatedTask: TaskSchemaUpdate) => {
    if (!data) return

    const { startTime, endTime, startDate, dueDate, taskPriority, taskStatus, ...taskRest } =
      updatedTask
    const [startDateWithTime, dueDateWithTime] = addCorrectTimeInDates(
      startTime,
      endTime,
      startDate,
      dueDate,
    )

    const taskId = data.id
    const departmentId = data.departmentId
    const orderTask = data.orderTask

    TOAST.PROMISE(
      mutateAsync({
        ...taskRest,
        id: taskId,
        taskPriority: taskPriority as TaskPriority,
        taskStatus: taskStatus as TaskStatus,
        departmentId: departmentId,
        orderTask: orderTask,
        startDate: formatDate(startDateWithTime),
        dueDate: formatDate(dueDateWithTime),
      }),
      "Данные обновлены",
    )

    close()
  }

  return <TaskForm form={form} isPending={isPending} onSubmit={onSubmit} />
}

export default EditTaskForm
