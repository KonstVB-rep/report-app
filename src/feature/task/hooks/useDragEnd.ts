// import { useCallback, useEffect, useState } from "react"
// import type { DropResult } from "@hello-pangea/dnd"
// import type { TaskStatus } from "@prisma/client"
// import type { TaskWithUserInfo } from "@/entities/task/types"
// import { useUpdateTasksOrder } from "./mutate"

// const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
//   const result = Array.from(list)
//   const [removed] = result.splice(startIndex, 1)
//   result.splice(endIndex, 0, removed)
//   return result
// }

// const useDragEnd = (data: TaskWithUserInfo[]) => {
//   const { mutate, isPending } = useUpdateTasksOrder()

//   const [tasks, setTasks] = useState<TaskWithUserInfo[]>([])

//   useEffect(() => {
//     setTasks(data)
//   }, [data])

//   const onDragEnd = useCallback(
//     (result: DropResult) => {
//       const { destination, source } = result
//       if (!destination) return

//       if (destination.droppableId === source.droppableId && destination.index === source.index)
//         return

//       const currentTasks = [...tasks]

//       const sourceTasks = currentTasks.filter((task) => task.taskStatus === source.droppableId)
//       const destinationTasks = currentTasks.filter(
//         (task) => task.taskStatus === destination.droppableId,
//       )

//       if (source.droppableId === destination.droppableId) {
//         // Перемещение внутри одного столбца
//         const reordered = reorder(sourceTasks, source.index, destination.index)
//         reordered.forEach((task, i) => {
//           task.orderTask = i
//         })

//         const updated = currentTasks.map((task) =>
//           task.taskStatus === source.droppableId
//             ? (reordered.find((t) => t.id === task.id) ?? task)
//             : task,
//         )

//         setTasks(updated)
//         mutate({ updatedTasks: updated })
//       } else {
//         // Перемещение между разными столбцами
//         const [movedCard] = sourceTasks.splice(source.index, 1)
//         movedCard.taskStatus = destination.droppableId as TaskStatus
//         destinationTasks.splice(destination.index, 0, movedCard)

//         sourceTasks.forEach((task, i) => {
//           task.orderTask = i
//         })
//         destinationTasks.forEach((task, i) => {
//           task.orderTask = i
//         })

//         const updated = currentTasks.map((task) => {
//           const inSource = sourceTasks.find((t) => t.id === task.id)
//           const inDest = destinationTasks.find((t) => t.id === task.id)
//           return inSource ?? inDest ?? task
//         })

//         setTasks(updated)
//         mutate({ updatedTasks: updated })
//       }
//     },
//     [tasks, mutate],
//   )

//   return { onDragEnd, tasks, isPending }
// }

// export default useDragEnd
import { useCallback, useEffect, useMemo, useState } from "react"
import type { DropResult } from "@hello-pangea/dnd"
import type { TaskStatus } from "@prisma/client"
import type { TaskWithUserInfo } from "@/entities/task/types"
import { useUpdateTasksOrder } from "./mutate"

const useDragEnd = (initialData: TaskWithUserInfo[]) => {
  const [tasks, setTasks] = useState<TaskWithUserInfo[]>(initialData)
  const { mutate, isPending } = useUpdateTasksOrder()

  // Синхронизация с пропсами (важно при обновлении извне)
  useEffect(() => {
    setTasks(initialData)
  }, [initialData])

  // Группируем задачи по колонкам заранее (O(n))
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
    // Сортируем каждую группу
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

      // Удаляем из старого места, вставляем в новое
      // Это упрощенная логика обновления порядка:
      const sourceCol = columns[sId].filter((t) => t.id !== draggableId)
      const destCol = sId === dId ? sourceCol : [...columns[dId]]
      destCol.splice(destination.index, 0, movedTask)

      // Пересчитываем orderTask только для затронутых колонок
      destCol.forEach((t, i) => {
        t.orderTask = i
      })
      if (sId !== dId) {
        sourceCol.forEach((t, i) => {
          t.orderTask = i
        })
      }

      // Формируем итоговый массив
      const updatedArray = newTasks.map((t) => {
        const foundInDest = destCol.find((d) => d.id === t.id)
        const foundInSource = sourceCol.find((s) => s.id === t.id)
        return foundInDest ?? foundInSource ?? t
      })

      setTasks(updatedArray)

      // Отправляем только те задачи, чьи orderTask или status реально изменились
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
