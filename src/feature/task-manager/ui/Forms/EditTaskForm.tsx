import { zodResolver } from "@hookform/resolvers/zod";
import { TaskPriority, TaskStatus } from "@prisma/client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { TOAST } from "@/shared/ui/Toast";

import { useGetTask } from "../../hooks/query";
import { useUpdateTask } from "../../hooks/mutate";
import { TaskFormSchema, TaskSchema } from "../../model/schema";
import { defaultTaskValues } from "../../model/defaultvaluesForm";
import TaskForm from "./TaskForm";
import { addCorrectTimeInDates, formatDate } from "../../lib/helpers";


type EditTaskFormProps = {
 close: Dispatch<SetStateAction<void>>;
 taskId: string;
};

const EditTaskForm =({
  close,
  taskId,
}: EditTaskFormProps) => {
  const { data: task, isPending: isLoading} = useGetTask(taskId);

  const form = useForm<TaskSchema>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: defaultTaskValues,
  });

  const { mutateAsync, isPending } = useUpdateTask();

  const onSubmit = (updatedTask: TaskSchema) => {
  if (!task) return;

  const { startTime, endTime, startDate, dueDate, ...taskRest } = updatedTask;
  const [startDateWithTime, dueDateWithTime] = addCorrectTimeInDates(startTime, endTime, startDate, dueDate);

  // ✅ Выносим `id` и `departmentId` до вызова `mutateAsync`
  const taskId = task.id;
  const departmentId = task.departmentId;
  const orderTask = task.orderTask;

  TOAST.PROMISE(
    mutateAsync({
      ...taskRest,
      id: taskId,
      departmentId: departmentId,
      orderTask: orderTask,
      startDate: formatDate(startDateWithTime),
      dueDate: formatDate(dueDateWithTime)
    }),
    "Данные обновлены"
  );

  close();
};

  useEffect(() => {
    if (task && !isLoading) {
      form.reset({
        title: task.title,
        description: task.description,
        taskStatus: task.taskStatus as TaskStatus,
        taskPriority: task.taskPriority as TaskPriority,
        executorId: task.executorId,
        dueDate: new Date(task.dueDate.toISOString()),
        startDate: new Date(task.startDate.toISOString()),
        startTime: new Date(task.startDate).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false 
                }),
        endTime: new Date(task?.dueDate).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false 
                })
      });
    }
  }, [form, task, isLoading]);


  // if (isLoading) <FormDealSkeleton />;

  return (
   <TaskForm form={form} isPending={isPending} onSubmit={onSubmit}/>
  );
};

export default EditTaskForm;
