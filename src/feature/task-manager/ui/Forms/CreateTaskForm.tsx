import React from 'react'
import TaskForm from './TaskForm';

import { TOAST } from '@/shared/ui/Toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateTask } from '../../hooks/mutate';
import { defaultTaskValues } from '../../model/defaultvaluesForm';
import { TaskStatus } from '@prisma/client';
import { useParams } from 'next/navigation';
import { addCorrectTimeInDates, formatDate } from '../../lib/helpers';
import { TaskFormSchema, TaskSchema } from '../../model/schema';


const CreateTaskForm = () => {
  const {departmentId} = useParams()

  const form = useForm<TaskSchema>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {...defaultTaskValues, taskStatus: TaskStatus.OPEN},
  });

  const { mutateAsync, isPending } = useCreateTask();

  const onSubmit = (task: TaskSchema) => {
    const {startTime, endTime, startDate, dueDate, ...taskRest} = task;
    const [startDateWithTime, dueDateWithTime] = addCorrectTimeInDates(startTime, endTime,startDate, dueDate)

    TOAST.PROMISE(mutateAsync({...taskRest, startDate: formatDate(startDateWithTime), dueDate: formatDate(dueDateWithTime), departmentId: departmentId as string}), "Задача добавлена");
    form.reset();
  };

  // if (isLoading) <FormDealSkeleton />;

  return (
   <TaskForm form={form} isPending={isPending} onSubmit={onSubmit}/>
  );
};

export default CreateTaskForm