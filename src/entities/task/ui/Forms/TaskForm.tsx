import React, {useMemo} from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DatePickerFormField from "@/shared/ui/Inputs/DatePickerFormField";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";
import SelectFormField from "@/shared/ui/SelectForm/SelectFormField";

import { LABEL_TASK_PRIORITY, LABEL_TASK_STATUS } from "../../model/constants";
import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import { useParams } from "next/navigation";
import { DepartmentInfo } from "@/entities/department/types";

type TaskFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
};

const taskStatusOptions = transformObjValueToArr(LABEL_TASK_STATUS);
const taskPriorityOptions = transformObjValueToArr(LABEL_TASK_PRIORITY);

const setSelectValue = <T extends FieldValues>(
  form: UseFormReturn<T>,
  name: keyof T,
  selected: unknown
) => {
  if (selected) {
    form.setValue(name as Path<T>, selected as PathValue<T, Path<T>>);
  }
};

const TaskForm = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
}: TaskFormProps<T>) => {

  const { departmentId } = useParams();
  const error = (name: keyof T) =>
    form.formState.errors[name]?.message as string;

  const {departments} = useStoreDepartment();

  const usersList = useMemo(() => {
    const currentDepartment = departments?.find((item: DepartmentInfo) => item.id === (departmentId ? +departmentId : ""));
    return  currentDepartment?.users.reduce((acc, user) => {
      acc.push([user.id, user.username])
      return acc
    }, [] as [string,string][]);
  }, [departmentId, departments]);


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
              errorMessage={error("title")}
              required
              placeholder="Название..."
            />

            <InputTextForm
              name={"description" as Path<T>}
              label="Описание"
              control={form.control}
              errorMessage={error("description")}
              required
              placeholder="Описание..."
            />

            <SelectFormField
              name={"taskStatus" as Path<T>}
              label="Статус"
              control={form.control}
              errorMessage={error("taskStatus")}
              options={taskStatusOptions}
              placeholder="Выберите направление"
              onValueChange={(selected) =>
                setSelectValue(form, "taskStatus", selected)
              }
              required
            />

            <SelectFormField
              name={"taskPriority" as Path<T>}
              label="Приоритет"
              control={form.control}
              errorMessage={error("taskPriority")}
              options={taskPriorityOptions}
              placeholder="Приоритет задачи"
              onValueChange={(selected) =>
                setSelectValue(form, "taskPriority", selected)
              }
              required
            />

             <SelectFormField
              name={"executorId" as Path<T>}
              label="Исполнитель"
              control={form.control}
              errorMessage={error("executorId")}
              options={usersList}
              className="capitalize"
              placeholder="Выберите исполнителя"
              onValueChange={(selected) =>
                setSelectValue(form, "executorId", selected)
              }
              required
            />
            
            <div className="flex flex-wrap gap-2 items-end">
              <DatePickerFormField<UseFormReturn<T>>
                name={"startDate" as Path<T>}
                label="Начало"
                control={form.control}
                errorMessage={error("startDate")}
                className="basis-1/3"
                required
              />

              <InputTextForm
                name={"startTime" as Path<T>}
                label=""
                control={form.control}
                errorMessage={error("startTime")}
                type="time"
                required
                placeholder="Описание..."
              />
            </div>

             <div className="flex flex-wrap gap-2 items-end">
               <DatePickerFormField<UseFormReturn<T>>
                name={"dueDate" as Path<T>}
                label="Конец"
                control={form.control}
                errorMessage={error("dueDate")}
                className="basis-1/3"
                required
            />

              <InputTextForm
                name={"endTime" as Path<T>}
                label=""
                control={form.control}
                errorMessage={error("endTime")}
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
