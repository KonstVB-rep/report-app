import type React from "react"
import { DepartmentLabels } from "@/entities/department/types"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import InputPassword from "@/shared/custom-components/ui/Inputs/InputPassword"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import { MultiSelectNativeForm } from "@/shared/custom-components/ui/MultiSlectComponent"
import SelectComponent from "@/shared/custom-components/ui/SelectForm/SelectComponent"
import { cn, formatPhoneNumber } from "@/shared/lib/utils"
import type { ActionResponse } from "@/shared/types"
import { RolesUser } from "../model/objectTypes"
import { OPTIONS, type UserFormData, type UserFormEditData } from "../types"

type UserFormProps<T extends UserFormData | UserFormEditData> = {
  state: ActionResponse<T>
  onSubmit: React.FormEventHandler<HTMLFormElement>
  isPending: boolean
  setState: React.Dispatch<React.SetStateAction<ActionResponse<T>>>
}
const UserForm = <T extends UserFormData | UserFormEditData>({
  state,
  onSubmit,
  isPending,
  setState,
}: UserFormProps<T>) => {
  const getFieldError = (fieldName: keyof UserFormData) => {
    return state?.errors?.properties?.[fieldName]?.errors[0]
  }

  return (
    <form
      className="flex max-h-[85vh] w-full flex-col gap-8 overflow-y-auto px-2 py-8"
      onSubmit={onSubmit}
    >
      <MotionDivY className="grid gap-1">
        <div className="grid gap-2">
          <Label className="text-sm font-medium" htmlFor="username">
            Имя пользователя
          </Label>
          <Input
            aria-describedby="username"
            className={getFieldError("username") ? "border-red-500" : ""}
            defaultValue={state.inputs?.username}
            disabled={isPending}
            id="username"
            name={"username"}
            placeholder="Введите имя пользователя..."
          />
          {getFieldError("username") && (
            <p className="text-sm text-red-500" id="username">
              {getFieldError("username")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium" htmlFor="email">
            Email
          </Label>
          <Input
            aria-describedby="email"
            className={getFieldError("email") ? "border-red-500" : ""}
            defaultValue={state.inputs?.email}
            disabled={isPending}
            id="email"
            name={"email"}
            placeholder="Введите email..."
          />
          {getFieldError("email") && (
            <p className="text-sm text-red-500" id="email">
              {getFieldError("email")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium" htmlFor="phone">
            Телефон
          </Label>
          <Input
            aria-describedby="phone"
            className={getFieldError("phone") ? "border-red-500" : ""}
            defaultValue={state.inputs?.phone}
            disabled={isPending}
            id="phone"
            name={"phone"}
            onInput={(e) => {
              const input = e.target as HTMLInputElement
              const value = input.value
              input.value = formatPhoneNumber(value)
            }}
            placeholder="+7 (999) 123-45-67"
            title="Формат: +7 (999) 123-45-67"
          />
          {getFieldError("phone") && (
            <p className="text-sm text-red-500" id="phone">
              {getFieldError("phone")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium" htmlFor="user_password">
            Пароль
          </Label>

          <InputPassword
            aria-describedby="user_password"
            autoComplete="off"
            className={getFieldError("user_password") ? "border-red-500" : ""}
            defaultValue={state.inputs?.user_password}
            disabled={isPending}
            id="user_password"
            name={"user_password"}
            placeholder="Введите пароль..."
            type="password"
          />

          {getFieldError("user_password") && (
            <p className="text-sm text-red-500" id="user_password">
              {getFieldError("user_password")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium" htmlFor="position">
            Должность
          </Label>
          <Input
            aria-describedby="position"
            className={getFieldError("position") ? "border-red-500" : ""}
            defaultValue={state.inputs?.position}
            disabled={isPending}
            id="position"
            name={"position"}
            placeholder="Введите должность..."
          />
          {getFieldError("position") && (
            <p className="text-sm text-red-500" id="position">
              {getFieldError("position")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium" htmlFor="department">
            Отдел
          </Label>
          <SelectComponent
            aria-describedby="department"
            className={cn("capitalize", getFieldError("department") ? "border-red-500" : "")}
            disabled={isPending}
            name={"department"}
            onValueChange={(val) => {
              if (!val) return
              setState((prev) => ({
                ...prev,
                inputs: {
                  ...(prev.inputs as Partial<T>),
                  department: val as unknown as T extends {
                    department: infer D
                  }
                    ? D
                    : never,
                },
              }))
            }}
            options={Object.entries(DepartmentLabels)}
            placeholder="Выберите отдел"
            value={state.inputs?.department}
          />
          {getFieldError("department") && (
            <p className="text-sm text-red-500" id="department">
              {getFieldError("department")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium" htmlFor="role">
            Роль
          </Label>
          <SelectComponent
            aria-describedby="role"
            className={cn("capitalize", getFieldError("role") ? "border-red-500" : "")}
            disabled={isPending}
            name={"role"}
            onValueChange={(val) => {
              if (!val) return
              setState((prev) => ({
                ...prev,
                inputs: {
                  ...(prev.inputs as Partial<T>),
                  role: val as unknown as T extends { role: infer R } ? R : never,
                },
              }))
            }}
            options={Object.entries(RolesUser)}
            placeholder="Выберите роль"
            value={state.inputs?.role ?? ""}
          />
          {getFieldError("role") && (
            <p className="text-sm text-red-500" id="role">
              {getFieldError("role")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium" htmlFor="permissions">
            Разрешения
          </Label>
          <MultiSelectNativeForm
            aria-describedby="permissions"
            defaultValue={
              state.inputs?.permissions ? state.inputs.permissions.map((s) => s.trim()) : undefined
            }
            disabled={isPending}
            id="permissions"
            name={"permissions"}
            options={OPTIONS}
            placeholder="Выберите разрешения"
          />
          {getFieldError("permissions") && (
            <p className="text-sm text-red-500" id="permissions">
              {getFieldError("permissions")}
            </p>
          )}
        </div>
      </MotionDivY>
      <SubmitFormButton isPending={isPending} title="Сохранить" />
    </form>
  )
}

export default UserForm
