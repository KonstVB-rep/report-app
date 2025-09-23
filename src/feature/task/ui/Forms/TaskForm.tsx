import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import { DepartmentInfo } from "@/entities/department/types";
import {
  LABEL_TASK_PRIORITY,
  LABEL_TASK_STATUS,
} from "@/feature/task/model/constants";
import { Form } from "@/shared/components/ui/form";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import DatePickerFormField from "@/shared/custom-components/ui/Inputs/DatePickerFormField";
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/custom-components/ui/Overlay";
import SelectFormField from "@/shared/custom-components/ui/SelectForm/SelectFormField";
import {
  pageParamsSchemaDepsId,
  useTypedParams,
} from "@/shared/hooks/useTypedParams";
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr";

type TaskFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
};

const taskStatusOptions = transformObjValueToArr(LABEL_TASK_STATUS);
const taskPriorityOptions = transformObjValueToArr(LABEL_TASK_PRIORITY);

const TaskForm = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
}: TaskFormProps<T>) => {
  const { departmentId } = useTypedParams(pageParamsSchemaDepsId);
  const getError = (name: keyof T) =>
    form.formState.errors[name]?.message as string | undefined;

  const { departments } = useStoreDepartment();

  const usersList: [string, string][] =
    departments
      ?.find((item: DepartmentInfo) => item.id === Number(departmentId))
      ?.users.map((user) => [user.id, user.username]) || [];

  return (
    <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid max-h-[82vh] min-w-full gap-5 overflow-y-auto p-1"
        >
          <div className="flex flex-col gap-1">
            <InputTextForm
              name={"title" as Path<T>}
              label="Название сделки"
              control={form.control}
              errorMessage={getError("title")}
              required
              placeholder="Название..."
            />

            <InputTextForm
              name={"description" as Path<T>}
              label="Описание"
              control={form.control}
              errorMessage={getError("description")}
              required
              placeholder="Описание..."
            />

            <SelectFormField
              name={"taskStatus" as Path<T>}
              label="Статус"
              control={form.control}
              errorMessage={getError("taskStatus")}
              options={taskStatusOptions}
              placeholder="Выберите направление"
              required
            />

            <SelectFormField
              name={"taskPriority" as Path<T>}
              label="Приоритет"
              control={form.control}
              errorMessage={getError("taskPriority")}
              options={taskPriorityOptions}
              placeholder="Приоритет задачи"
              required
            />

            <SelectFormField
              name={"executorId" as Path<T>}
              label="Исполнитель"
              control={form.control}
              errorMessage={getError("executorId")}
              options={usersList}
              className="capitalize"
              placeholder="Выберите исполнителя"
              required
            />

            <div className="flex flex-wrap gap-2 items-end">
              <DatePickerFormField
                name={"startDate" as Path<T>}
                label="Начало"
                control={form.control}
                errorMessage={getError("startDate")}
                className="basis-1/3"
                required
              />

              <InputTextForm
                name={"startTime" as Path<T>}
                label=""
                control={form.control}
                errorMessage={getError("startTime")}
                type="time"
                required
                placeholder="Описание..."
              />
            </div>

            <div className="flex flex-wrap gap-2 items-end">
              <DatePickerFormField
                name={"dueDate" as Path<T>}
                label="Конец"
                control={form.control}
                errorMessage={getError("dueDate")}
                className="basis-1/3"
                required
              />

              <InputTextForm
                name={"endTime" as Path<T>}
                label=""
                control={form.control}
                errorMessage={getError("endTime")}
                type="time"
                required
                placeholder="Описание..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <SubmitFormButton
              title="Сохранить"
              isPending={isPending}
              className="ml-auto mr-2 w-max"
            />
          </div>
        </form>
      </Form>
    </MotionDivY>
  );
};

export default TaskForm;
