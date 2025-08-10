import dynamic from "next/dynamic";

import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useStoreUser from "@/entities/user/store/useStoreUser";

import {
  LABEL_TASK_PRIORITY,
  LABEL_TASK_STATUS,
  TASK_PRIORITY_COLOR_BORDER,
} from "../model/constants";
import { TaskWithUserInfo } from "../types";
import { cleanDistance } from "../lib/helpers";

const EditTaskDialogButton = dynamic(
  () => import("./Modals/EditTaskDialogButton")
);

const DelTaskDialogButton = dynamic(
  () => import("./Modals/DelTaskDialogButton")
);


type TaskCardProps = {
  task: TaskWithUserInfo;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const { authUser } = useStoreUser();

  if (!authUser || !task) return null;

  const duedate = cleanDistance(new Date(task.dueDate));

  const formattedDueDate = format(task.dueDate, "d MMMM yyyy HH:mm", {
    locale: ru,
  });
  const formattedCreated = format(task.createdAt, "d MMMM yyyy HH:mm", {
    locale: ru,
  });

  const isCanActionTask =
    task.assignerId === authUser.id || task.executorId === authUser.id;

  return (
    <div className="grid gap-2">
      {isCanActionTask && (
        <div className="flex gap-2 bg-background p-1 rounded-md">
          <EditTaskDialogButton id={task.id} />
          <DelTaskDialogButton id={task.id} />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Badge variant="outline" className="text-lg p-3 flex gap-3">
          Статус: {LABEL_TASK_STATUS[task.taskStatus]}
        </Badge>
        <Badge variant="outline" className="text-lg p-3 flex gap-3">
          Приоритет: {LABEL_TASK_PRIORITY[task.taskPriority]}
        </Badge>
      </div>
      <Card
        className={`relative p-0 pb-3 grid gap-3 cursor-pointer drop-shadow-xl max-w-xl border-4 ${TASK_PRIORITY_COLOR_BORDER[task.taskPriority]}`}
      >
        <CardHeader className="pt-3 text-lg px-3 py-2 rounded-lg">
          Наименование: {task.title}
        </CardHeader>
        <CardDescription className="px-3 py-0 text-lg">
          Описание: {task.description}
        </CardDescription>
        {/* <CardContent className="flex gap-2 px-3 py-0">
          <Badge>{LABEL_TASK_STATUS[task.taskStatus]}</Badge>
          <Badge variant="outline" className="text-lg">
            Приоритет: {LABEL_TASK_PRIORITY[task.taskPriority]}
          </Badge>
        </CardContent> */}
        <CardFooter className="grid gap-3 px-3 py-0">
          <div className="flex flex-wrap gap-2">
            <div className="grid gap-1 flex-1">
              <span className="capitalize text-md">автор:</span>
              <Badge className="text-lg capitalize">
                {task.assigner.username}
              </Badge>
            </div>
            <div className="grid gap-1 flex-1">
              <span className="capitalize text-md">исполнитель:</span>
              <Badge className="text-lg capitalize">
                {task.executor.username}
              </Badge>
            </div>
          </div>
          <div className="text-md text-gray-500 w-full">
            <span className="capitalize">Создана:</span> {formattedCreated}
          </div>
          <div className="text-md text-primary w-full">
            <span className="capitalize">Срок:</span> {duedate} -{" "}
            {formattedDueDate}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaskCard;
