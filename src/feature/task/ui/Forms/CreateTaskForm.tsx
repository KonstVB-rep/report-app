import { zodResolver } from "@hookform/resolvers/zod";
import { TaskPriority, TaskStatus } from "@prisma/client";

import React from "react";
import { Resolver, useForm } from "react-hook-form";

import { addCorrectTimeInDates, formatDate } from "@/entities/task/lib/helpers";
import { defaultTaskValues } from "@/feature/task/model/defaultvaluesForm";
import { TaskFormSchema, TaskSchema } from "@/feature/task/model/schema";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import {
  pageParamsSchemaDepsId,
  useTypedParams,
} from "@/shared/hooks/useTypedParams";

import { useCreateTask } from "../../hooks/mutate";
import TaskForm from "./TaskForm";

const CreateTaskForm = () => {
  const { departmentId } = useTypedParams(pageParamsSchemaDepsId);

  const form = useForm<TaskSchema>({
    resolver: zodResolver(TaskFormSchema) as Resolver<TaskSchema>,
    defaultValues: { ...defaultTaskValues, taskStatus: TaskStatus.OPEN },
  });

  const { mutateAsync, isPending } = useCreateTask();
  const { reset } = form;

  const onSubmit = (task: TaskSchema) => {
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
        departmentId: departmentId,
      }),
      "Задача добавлена"
    );
    reset();
  };

  return <TaskForm form={form} isPending={isPending} onSubmit={onSubmit} />;
};

export default CreateTaskForm;
