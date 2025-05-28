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

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

const Kanban = ({ data }: KanbanProps) => {

  const [filteredTask, setFilteredTasks] = useState(data);

  const { mutate, isPending, isError } = useUpdateTasksOrder();

  const onDragEnd = useCallback(
    (result: DropResult<string>) => {
      const { destination, source } = result;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;
      // const copyTasks = [...data]
      const sourceList = [...filteredTask].filter(
        (task) => task.taskStatus === source.droppableId
      );
      const destinationList = [...filteredTask].filter(
        (task) => task.taskStatus === destination.droppableId
      );

      if (source.droppableId === destination.droppableId) {
        const reorderCards = reorder(
          sourceList,
          source.index,
          destination.index
        );

        reorderCards.forEach((card, i) => (card.orderTask = i));
      } else {
        const [movedCard] = sourceList.splice(source.index, 1);

        movedCard.taskStatus = destination.droppableId as TaskStatus;
        destinationList.splice(destination.index, 0, movedCard);

        sourceList.forEach((card, i) => (card.orderTask = i));
        destinationList.forEach((card, i) => (card.orderTask = i));
      }

      const sortedTasks = [...filteredTask].sort(
        (a, b) => a.orderTask - b.orderTask
      );

      setFilteredTasks(sortedTasks);
      mutate({ updatedTasks: sortedTasks });
    },
    [filteredTask, mutate]
  );

  useEffect(() => {
    setFilteredTasks(data);
  }, [data]);

  console.log(isPending)

  return (
    <div className="relative grid gap-2">
      {isPending && <UpdateLoaderKanban />}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-secondary rounded-md">
          {StatusesTask.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <MotionDivY
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  <h3 className="flex gap-1 items-center justify-center font-semibold text-center text-sm p-3 rounded-md bg-card">
                    {column.icon}
                    {column.name}
                  </h3>

                  <div className="mt-40">
                    {filteredTask
                    ?.filter((task) => task.taskStatus === column.key)
                    .map((task, index) => (
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
                  </div>
                    
                  {provided.placeholder}
                </MotionDivY>
              )}
            </Droppable>
          ))}
        </div>
        
         {filteredTask.length === 0 && !isPending && !isError ? (
            <div className="grid place-items-center p-4 bg-secondary rounded-md">
              <p className="text-xl text-center">Нет данных</p>
            </div>
          ) : null}
      </DragDropContext>
    </div>
  );
};

export default Kanban;
