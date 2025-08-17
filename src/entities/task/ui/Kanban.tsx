"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { TaskStatus } from "@prisma/client";

import { CheckCircle2Icon, LoaderIcon, StickyNote } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import useDragEnd from "../hooks/useDragEnd";
import { TaskWithUserInfo } from "../types";
import TaskKanbanCard from "./TaskKanbanCard";
import UpdateLoaderKanban from "./UpdateLoaderKanban";

type KanbanProps = {
  data: TaskWithUserInfo[];
  onChange?: (tasks: TaskWithUserInfo[]) => void;
};

const StatusesTask = [
  {
    name: "Открыта",
    key: TaskStatus.OPEN,
    icon: <StickyNote size={16} />,
  },
  {
    name: "В работе",
    key: TaskStatus.IN_PROGRESS,
    icon: <LoaderIcon size={16} />,
  },
  {
    name: "Завершена",
    key: TaskStatus.DONE,
    icon: (
      <CheckCircle2Icon
        size={16}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-secondary rounded-md">
          {StatusesTask.map((column) => {
            const columnTasks = tasks
              .filter((t) => t.taskStatus === column.key)
              .sort((a, b) => a.orderTask - b.orderTask);

            return (
              <div key={column.key} className="space-y-2">
                <h3 className="flex gap-1 items-center justify-center font-semibold text-center text-sm p-3 rounded-md bg-card">
                  {column.icon}
                  {column.name}
                </h3>

                <Droppable
                  droppableId={column.key}
                  renderClone={(provided, snapshot, rubric) => {
                    const task = columnTasks[rubric.source.index];
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                        className="shadow-lg"
                      >
                        <TaskKanbanCard task={task} />
                      </div>
                    );
                  }}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex flex-col gap-2 min-h-[120px] p-2 rounded-md transition-colors",
                        columnTasks.length <= 0 &&
                          "border border-dashed rounded-sm border-primary grid place-content-center",
                        snapshot.isDraggingOver && "bg-primary/5"
                      )}
                    >
                      {columnTasks.length > 0 ? (
                        columnTasks.map((task, index) => (
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
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Нет задач
                        </p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
