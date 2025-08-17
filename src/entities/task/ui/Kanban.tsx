import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { TaskStatus } from "@prisma/client";

import dynamic from "next/dynamic";

import { CheckCircle2Icon, LoaderIcon, StickyNote } from "lucide-react";

import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import { cn } from "@/shared/lib/utils";

import useDragEnd from "../hooks/useDragEnd";
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

const Kanban = ({ data }: KanbanProps) => {
  const { onDragEnd, tasks, isPending } = useDragEnd(data);

  return (
    <div className="relative grid gap-2">
      {isPending && <UpdateLoaderKanban />}

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className="@container inline-size w-full"
          style={{ containerType: "inline-size" }}
        >
          <div className="grid grid-cols-1  gap-3 p-4 bg-secondary rounded-md custom-grid">
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
                        className={cn(
                          "flex flex-col gap-2 min-h-[120px]",
                          columnTasks.length <= 0 &&
                            "border border-dashed rounded-sm border-primary grid place-content-center"
                        )}
                      >
                        {columnTasks.length > 0 ? (
                          <MotionDivY className="space-y-2 px-2 border-x border-dashed border-secondary">
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
                        ) : (
                          <div className="w-full h-full">
                            <p>Нет задач</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
