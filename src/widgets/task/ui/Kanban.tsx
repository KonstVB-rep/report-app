"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { TaskStatus } from "@prisma/client";
import { CheckCircle2Icon, LoaderIcon, StickyNote } from "lucide-react";
import type { TaskWithUserInfo } from "@/entities/task/types";
import UpdateLoaderKanban from "@/entities/task/ui/UpdateLoaderKanban";
import useDragEnd from "@/feature/task/hooks/useDragEnd";
import TaskKanbanCard from "@/feature/task/ui/TaskKanbanCard";
import { cn } from "@/shared/lib/utils";

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
        className="text-green-500 dark:text-green-400"
        size={16}
      />
    ),
  },
] as const;

// const Kanban = ({ data }: KanbanProps) => {
//   const { onDragEnd, tasks, isPending } = useDragEnd(data)

//   return (
//     <div className="relative grid gap-2">
//       {isPending && <UpdateLoaderKanban />}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-secondary rounded-md">
//           {StatusesTask.map((column) => {
//             const columnTasks = tasks
//               .filter((t) => t.taskStatus === column.key)
//               .sort((a, b) => a.orderTask - b.orderTask)

//             return (
//               <div className="space-y-2" key={column.key}>
//                 <h3 className="flex gap-1 items-center justify-center font-semibold text-center text-sm p-3 rounded-md bg-card">
//                   {column.icon}
//                   {column.name}
//                 </h3>

//                 <Droppable
//                   droppableId={column.key}
//                   renderClone={(provided, _, rubric) => {
//                     const task = columnTasks[rubric.source.index]
//                     return (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="shadow-lg"
//                         style={provided.draggableProps.style}
//                       >
//                         <TaskKanbanCard task={task} />
//                       </div>
//                     )
//                   }}
//                 >
//                   {(provided, snapshot) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       className={cn(
//                         "flex flex-col gap-2 min-h-[120px] p-2 rounded-md transition-colors",
//                         columnTasks.length <= 0 &&
//                           "border border-dashed rounded border-primary grid place-content-center",
//                         snapshot.isDraggingOver && "bg-primary/5",
//                       )}
//                     >
//                       {columnTasks.length > 0 ? (
//                         columnTasks.map((task, index) => (
//                           <Draggable draggableId={task.id} index={index} key={task.id}>
//                             {(provided) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                               >
//                                 <TaskKanbanCard task={task} />
//                               </div>
//                             )}
//                           </Draggable>
//                         ))
//                       ) : (
//                         <p className="text-sm text-muted-foreground">Нет задач</p>
//                       )}
//                       {provided.placeholder}
//                     </div>
//                   )}
//                 </Droppable>
//               </div>
//             )
//           })}
//         </div>
//       </DragDropContext>
//     </div>
//   )
// }
const Kanban = ({ data }: KanbanProps) => {
  // Теперь берем уже сгруппированные колонки из хука
  const { onDragEnd, columns, isPending } = useDragEnd(data);

  return (
    <div className="relative grid gap-2">
      {isPending && <UpdateLoaderKanban />}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-secondary rounded-md min-h-[500px]">
          {StatusesTask.map((column) => {
            const columnTasks = columns[column.key]; // Мгновенный доступ O(1)

            return (
              <div className="flex flex-col gap-2" key={column.key}>
                <h3 className="flex gap-2 items-center justify-center font-semibold p-3 rounded-md bg-card shadow-sm">
                  {column.icon}
                  <span>{column.name}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({columnTasks.length})
                  </span>
                </h3>

                <Droppable droppableId={column.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex flex-col gap-2 flex-1 p-2 rounded-md transition-all duration-200",
                        snapshot.isDraggingOver
                          ? "bg-primary/10"
                          : "bg-transparent",
                        columnTasks.length === 0 &&
                          "border-2 border-dashed border-muted-foreground/20",
                      )}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "transition-transform",
                                snapshot.isDragging && "scale-105 z-50",
                              )}
                            >
                              <TaskKanbanCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                        <p className="text-sm text-center text-muted-foreground mt-10">
                          Пусто
                        </p>
                      )}
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
