import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";
// import { TOAST } from "@/shared/ui/Toast";
import SelectFormField from "@/shared/ui/SelectForm/SelectFormField";
import { LABEL_TASK_PRIORITY, LABEL_TASK_STATUS } from "../types";
import { TaskFormSchema, TaskSchema } from "../model/schema";
// import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
// import { UserResponse } from "@/entities/user/types";
import { Task } from "@prisma/client";

const FormTask = ({task} : {task: Task}) => {

  // const { departments } = useStoreDepartment();

  // const users = departments && departments.find(dep => dep.name === "SALES")?.users.map((item: UserResponse) => ({id: item.id, userName: item.username}))

  const form = useForm<TaskSchema>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      taskStatus: task.taskStatus,
      taskPriority: task?.taskPriority ?? "",
      executor: task?.executorId,
      dueDate: task?.dueDate.toISOString(),
      startDate: task?.startDate.toISOString(),
    },
  });

  // const onSubmit = (data: TaskSchema) => {
  //   try {
  //     //  TOAST.PROMISE(mutateAsync(data), "Задача добавлена");
  //     form.reset();
  //   } catch (error) {
  //     console.error("Error add task:", error);
  //     TOAST.ERROR("Ошибка при создании задачи");
  //   }
  // };

  return (
    <>
      <Overlay isPending={false} />
      <Form {...form}>
        <form
          // onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[85vh] flex-col gap-8 overflow-y-auto px-2 py-8"
        >
          <MotionDivY className="grid gap-1">
            <InputTextForm
              name="title"
              label="Название"
              control={form.control}
              errorMessage={form.formState.errors.title?.message}
              minLength={3}
              maxLength={50}
              placeholder="Введите название задачи"
              className="w-ful "
              required
            />

            <InputTextForm
              name="description"
              label="Описание"
              control={form.control}
              errorMessage={form.formState.errors.description?.message}
              minLength={3}
              maxLength={50}
              placeholder="Введите описание"
              className="w-ful"
              required
            />

            <SelectFormField
                name="taskStatus"
                label="Статус"
                control={form.control}
                errorMessage={form.formState.errors.taskStatus?.message}
                options={Object.entries(LABEL_TASK_STATUS)}
                placeholder="Выберите статус"
                required
            />
        

            <SelectFormField
                name="taskPriority"
                label="Приоритет"
                control={form.control}
                errorMessage={form.formState.errors.taskPriority?.message}
                options={Object.entries(LABEL_TASK_PRIORITY)}
                placeholder="Выберите приоритет"
                required
            />

            {/* <SelectFormField
                name="executor"
                label="Исполнитель"
                control={form.control}
                errorMessage={form.formState.errors.executor?.message}
                options={Object.entries()}
                placeholder="Выберите исполнителя"
                required
            /> */}
            
          </MotionDivY>
        </form>
      </Form>
    </>
  );
};

export default FormTask;
