import { useCallback, useEffect, useMemo, useState } from "react"
import type { DropResult } from "@hello-pangea/dnd"
import type { TaskStatus } from "@prisma/client"
import type { TaskWithUserInfo } from "@/entities/task/types"
import { useUpdateTasksOrder } from "./mutate"

const useDragEnd = (initialData: TaskWithUserInfo[]) => {
  const [tasks, setTasks] = useState<TaskWithUserInfo[]>(initialData)
  const { mutate, isPending } = useUpdateTasksOrder()

  useEffect(() => {
    setTasks(initialData)
  }, [initialData])

  const columns = useMemo(() => {
    const groups: Record<TaskStatus, TaskWithUserInfo[]> = {
      OPEN: [],
      IN_PROGRESS: [],
      DONE: [],
      CANCELED: [],
    }
    tasks.forEach((task) => {
      groups[task.taskStatus]?.push(task)
    })
    Object.keys(groups).forEach((key) => {
      groups[key as TaskStatus].sort((a, b) => a.orderTask - b.orderTask)
    })
    return groups
  }, [tasks])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result
      if (!destination) return

      if (destination.droppableId === source.droppableId && destination.index === source.index)
        return

      const newTasks = [...tasks]
      const movedTaskIndex = newTasks.findIndex((t) => t.id === draggableId)
      if (movedTaskIndex === -1) return

      const movedTask = { ...newTasks[movedTaskIndex] }
      const sId = source.droppableId as TaskStatus
      const dId = destination.droppableId as TaskStatus

      movedTask.taskStatus = dId

      const sourceCol = columns[sId].filter((t) => t.id !== draggableId)
      const destCol = sId === dId ? sourceCol : [...columns[dId]]
      destCol.splice(destination.index, 0, movedTask)
      destCol.forEach((t, i) => {
        t.orderTask = i
      })
      if (sId !== dId) {
        sourceCol.forEach((t, i) => {
          t.orderTask = i
        })
      }
      const updatedArray = newTasks.map((t) => {
        const foundInDest = destCol.find((d) => d.id === t.id)
        const foundInSource = sourceCol.find((s) => s.id === t.id)
        return foundInDest ?? foundInSource ?? t
      })

      setTasks(updatedArray)

      const changedTasks = updatedArray.filter((t) => {
        const old = tasks.find((ot) => ot.id === t.id)
        return old?.orderTask !== t.orderTask || old?.taskStatus !== t.taskStatus
      })

      mutate({ updatedTasks: changedTasks })
    },
    [tasks, columns, mutate],
  )

  return { onDragEnd, columns, isPending }
}

export default useDragEnd
