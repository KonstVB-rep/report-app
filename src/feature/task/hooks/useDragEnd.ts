import { DropResult } from "@hello-pangea/dnd";
import { TaskStatus } from "@prisma/client";

import { useCallback, useEffect, useState } from "react";

import { TaskWithUserInfo } from "@/entities/task/types";

import { useUpdateTasksOrder } from "./mutate";

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const useDragEnd = (data: TaskWithUserInfo[]) => {
  const { mutate, isPending } = useUpdateTasksOrder();

  const [tasks, setTasks] = useState<TaskWithUserInfo[]>([]);

  useEffect(() => {
    setTasks(data);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const currentTasks = [...tasks];

      const sourceTasks = currentTasks.filter(
        (task) => task.taskStatus === source.droppableId
      );
      const destinationTasks = currentTasks.filter(
        (task) => task.taskStatus === destination.droppableId
      );

      if (source.droppableId === destination.droppableId) {
        // Перемещение внутри одного столбца
        const reordered = reorder(sourceTasks, source.index, destination.index);
        reordered.forEach((task, i) => (task.orderTask = i));

        const updated = currentTasks.map((task) =>
          task.taskStatus === source.droppableId
            ? (reordered.find((t) => t.id === task.id) ?? task)
            : task
        );

        setTasks(updated);
        mutate({ updatedTasks: updated });
      } else {
        // Перемещение между разными столбцами
        const [movedCard] = sourceTasks.splice(source.index, 1);
        movedCard.taskStatus = destination.droppableId as TaskStatus;
        destinationTasks.splice(destination.index, 0, movedCard);

        sourceTasks.forEach((task, i) => (task.orderTask = i));
        destinationTasks.forEach((task, i) => (task.orderTask = i));

        const updated = currentTasks.map((task) => {
          const inSource = sourceTasks.find((t) => t.id === task.id);
          const inDest = destinationTasks.find((t) => t.id === task.id);
          return inSource ?? inDest ?? task;
        });

        setTasks(updated);
        mutate({ updatedTasks: updated });
      }
    },
    [tasks, mutate]
  );

  return { onDragEnd, tasks, isPending };
};

export default useDragEnd;
