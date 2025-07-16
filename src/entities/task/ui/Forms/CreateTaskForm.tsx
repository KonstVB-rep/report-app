import { zodResolver } from "@hookform/resolvers/zod";
import { TaskPriority, TaskStatus } from "@prisma/client";

import React from "react";
import { useForm } from "react-hook-form";

import { useParams } from "next/navigation";

import { withAuthCheck } from "@/shared/lib/helpers/withAuthCheck";
import { TOAST } from "@/shared/ui/Toast";

import { useCreateTask } from "../../hooks/mutate";
import { addCorrectTimeInDates, formatDate } from "../../lib/helpers";
import { defaultTaskValues } from "../../model/defaultvaluesForm";
import { TaskFormSchema, TaskSchema } from "../../model/schema";
import TaskForm from "./TaskForm";

const CreateTaskForm = () => {
  const { departmentId } = useParams();

  const form = useForm<TaskSchema>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: { ...defaultTaskValues, taskStatus: TaskStatus.OPEN },
  });

  const { mutateAsync, isPending } = useCreateTask();
   const { reset } = form;

  const onSubmit = withAuthCheck(async (task: TaskSchema) => {
    const {
      startTime,
      endTime,
      startDate,
      dueDate,
      taskPriority,
      taskStatus,
      ...taskRest
    } = task;
    const [startDateWithTime, dueDateWithTime] = addCorrectTimeInDates(
      startTime,
      endTime,
      startDate,
      dueDate
    );

    TOAST.PROMISE(
      mutateAsync({
        ...taskRest,
        taskPriority: taskPriority as TaskPriority,
        taskStatus: taskStatus as TaskStatus,
        startDate: formatDate(startDateWithTime),
        dueDate: formatDate(dueDateWithTime),
        departmentId: departmentId as string,
      }),
      "Задача добавлена"
    );
    reset();
  });


  return <TaskForm form={form} isPending={isPending} onSubmit={onSubmit} />;
};

export default CreateTaskForm;
