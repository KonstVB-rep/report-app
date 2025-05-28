import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { TaskStatus } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2Icon, LoaderIcon, StickyNote } from "lucide-react";

import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import { useUpdateTasksOrder } from "../hooks/mutate";
import { TaskWithUserInfo } from "../types";
import TaskKanbanCard from "./TaskKanbanCard";

const UpdateLoaderKanban = dynamic(() => import("./UpdateLoaderKanban"));

type KanbanProps = {
  data: TaskWithUserInfo[];
};

export const StatusesTask = [
  {
    name: "Открыта",
    key: TaskStatus.OPEN,
    icon: <StickyNote size="16" />,
  },
  {
    name: "В работе",
    key: TaskStatus.IN_PROGRESS,
    icon: <LoaderIcon size="16" />,
  },
  {
    name: "Завершена",
    key: TaskStatus.DONE,
    icon: (
      <CheckCircle2Icon
        size="16"
        className="text-green-500 dark:text-green-400"
      />
    ),
  },
] as const;

// Хелпер для reorder внутри одного столбца
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Kanban = ({ data }: KanbanProps) => {
  const { mutate, isPending, isError } = useUpdateTasksOrder();

  // Локальный стейт задач для мгновенного UI-обновления
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
            ? reordered.find((t) => t.id === task.id) ?? task
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

  return (
    <div className="relative grid gap-2">
      {isPending && <UpdateLoaderKanban />}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-secondary rounded-md">
          {StatusesTask.map((column) => {
            const columnTasks = tasks
              .filter((task) => task.taskStatus === column.key)
              .sort((a, b) => a.orderTask - b.orderTask);

            return (
              <div key={column.key} className="space-y-2">
                <h3 className="flex gap-1 items-center justify-center font-semibold text-center text-sm p-3 rounded-md bg-card">
                  {column.icon}
                  {column.name}
                </h3>

                <Droppable droppableId={column.key}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex flex-col gap-2 min-h-[120px]"
                    >
                      <MotionDivY className="space-y-2 px-2 border-x border-dashed border-white">
                        {columnTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskKanbanCard task={task} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </MotionDivY>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>

        {data.length === 0 && !isPending && !isError && (
          <div className="grid place-items-center p-4 bg-secondary rounded-md">
            <p className="text-xl text-center">Нет данных</p>
          </div>
        )}
      </DragDropContext>
    </div>
  );
};

export default Kanban;
