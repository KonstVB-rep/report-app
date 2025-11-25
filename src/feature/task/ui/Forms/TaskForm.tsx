import type { FieldValues, Path, UseFormReturn } from "react-hook-form"
import useStoreDepartment from "@/entities/department/store/useStoreDepartment"
import type { DepartmentInfo } from "@/entities/department/types"
import { LABEL_TASK_PRIORITY, LABEL_TASK_STATUS } from "@/feature/task/model/constants"
import { Form } from "@/shared/components/ui/form"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import DatePickerFormField from "@/shared/custom-components/ui/Inputs/DatePickerFormField"
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import Overlay from "@/shared/custom-components/ui/Overlay"
import SelectFormField from "@/shared/custom-components/ui/SelectForm/SelectFormField"
import { pageParamsSchemaDepsId, useTypedParams } from "@/shared/hooks/useTypedParams"
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr"

type TaskFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  isPending: boolean
}

const taskStatusOptions = transformObjValueToArr(LABEL_TASK_STATUS)
const taskPriorityOptions = transformObjValueToArr(LABEL_TASK_PRIORITY)

const TaskForm = <T extends FieldValues>({ form, onSubmit, isPending }: TaskFormProps<T>) => {
  const { departmentId } = useTypedParams(pageParamsSchemaDepsId)
  const getError = (name: keyof T) => form.formState.errors[name]?.message as string | undefined

  const { departments } = useStoreDepartment()

  const usersList: [string, string][] =
    departments
      ?.find((item: DepartmentInfo) => item.id === Number(departmentId))
      ?.users.map((user) => [user.id, user.username]) || []

  return (
    <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          className="grid max-h-[82vh] min-w-full gap-5 overflow-y-auto p-1"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-1">
            <InputTextForm
              control={form.control}
              errorMessage={getError("title")}
              label="Название сделки"
              name={"title" as Path<T>}
              placeholder="Название..."
              required
            />

            <InputTextForm
              control={form.control}
              errorMessage={getError("description")}
              label="Описание"
              name={"description" as Path<T>}
              placeholder="Описание..."
              required
            />

            <SelectFormField
              control={form.control}
              errorMessage={getError("taskStatus")}
              label="Статус"
              name={"taskStatus" as Path<T>}
              options={taskStatusOptions}
              placeholder="Выберите направление"
              required
            />

            <SelectFormField
              control={form.control}
              errorMessage={getError("taskPriority")}
              label="Приоритет"
              name={"taskPriority" as Path<T>}
              options={taskPriorityOptions}
              placeholder="Приоритет задачи"
              required
            />

            <SelectFormField
              className="capitalize"
              control={form.control}
              errorMessage={getError("executorId")}
              label="Исполнитель"
              name={"executorId" as Path<T>}
              options={usersList}
              placeholder="Выберите исполнителя"
              required
            />

            <div className="flex flex-wrap gap-2 items-end">
              <DatePickerFormField
                className="basis-1/3"
                control={form.control}
                errorMessage={getError("startDate")}
                label="Начало"
                name={"startDate" as Path<T>}
                required
              />

              <InputTextForm
                control={form.control}
                errorMessage={getError("startTime")}
                label=""
                name={"startTime" as Path<T>}
                placeholder="Описание..."
                required
                type="time"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-end">
              <DatePickerFormField
                className="basis-1/3"
                control={form.control}
                errorMessage={getError("dueDate")}
                label="Конец"
                name={"dueDate" as Path<T>}
                required
              />

              <InputTextForm
                control={form.control}
                errorMessage={getError("endTime")}
                label=""
                name={"endTime" as Path<T>}
                placeholder="Описание..."
                required
                type="time"
              />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <SubmitFormButton
              className="ml-auto mr-2 w-max"
              isPending={isPending}
              title="Сохранить"
            />
          </div>
        </form>
      </Form>
    </MotionDivY>
  )
}

export default TaskForm
