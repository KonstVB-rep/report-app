import React from "react";

import { DepartmentLabels } from "@/entities/department/types";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import { MultiSelectNativeForm } from "@/shared/custom-components/ui/MultiSlectComponent";
import SelectComponent from "@/shared/custom-components/ui/SelectForm/SelectComponent";
import { cn, formatPhoneNumber } from "@/shared/lib/utils";
import { ActionResponse } from "@/shared/types";

import { RolesUser } from "../model/objectTypes";
import { OPTIONS, UserFormData } from "../types";

const UserForm = ({
  state,
  onSubmit,
  isPending,
}: {
  state: ActionResponse<UserFormData>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isPending: boolean;
}) => {
  const getFieldError = (fieldName: keyof UserFormData) => {
    return state?.errors?.properties?.[fieldName]?.errors[0];
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex max-h-[85vh] flex-col gap-8 overflow-y-auto px-2 py-8"
    >
      <MotionDivY className="grid gap-1">
        <div className="grid gap-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Имя пользователя
          </Label>
          <Input
            id="username"
            name={"username"}
            placeholder="Введите имя пользователя..."
            defaultValue={state.inputs?.username}
            aria-describedby="username"
            className={getFieldError("username") ? "border-red-500" : ""}
          />
          {getFieldError("username") && (
            <p id="username" className="text-sm text-red-500">
              {getFieldError("username")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name={"email"}
            placeholder="Введите email..."
            defaultValue={state.inputs?.email}
            aria-describedby="email"
            className={getFieldError("email") ? "border-red-500" : ""}
          />
          {getFieldError("email") && (
            <p id="email" className="text-sm text-red-500">
              {getFieldError("email")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Телефон
          </Label>
          <Input
            id="phone"
            name={"phone"}
            placeholder="+7 (999) 123-45-67"
            title="Формат: +7 (999) 123-45-67"
            aria-describedby="phone"
            className={getFieldError("phone") ? "border-red-500" : ""}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              const value = input.value;
              input.value = formatPhoneNumber(value);
            }}
          />
          {getFieldError("phone") && (
            <p id="phone" className="text-sm text-red-500">
              {getFieldError("phone")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="user_password" className="text-sm font-medium">
            Пароль
          </Label>
          <Input
            id="user_password"
            name={"user_password"}
            type="password"
            autoComplete="off"
            placeholder="Введите пароль..."
            defaultValue={state.inputs?.user_password}
            aria-describedby="user_password"
            className={getFieldError("user_password") ? "border-red-500" : ""}
          />
          {getFieldError("user_password") && (
            <p id="user_password" className="text-sm text-red-500">
              {getFieldError("user_password")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="position" className="text-sm font-medium">
            Должность
          </Label>
          <Input
            id="position"
            name={"position"}
            placeholder="Введите должность..."
            defaultValue={state.inputs?.position}
            aria-describedby="position"
            className={getFieldError("position") ? "border-red-500" : ""}
          />
          {getFieldError("position") && (
            <p id="position" className="text-sm text-red-500">
              {getFieldError("position")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="department" className="text-sm font-medium">
            Отдел
          </Label>
          <SelectComponent
            placeholder="Выберите отдел"
            options={Object.entries(DepartmentLabels)}
            name={"department"}
            defaultValue={state.inputs?.department}
            aria-describedby="department"
            className={cn(
              "capitalize",
              getFieldError("department") ? "border-red-500" : ""
            )}
          />
          {getFieldError("department") && (
            <p id="department" className="text-sm text-red-500">
              {getFieldError("department")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role" className="text-sm font-medium">
            Роль
          </Label>
          <SelectComponent
            options={Object.entries(RolesUser)}
            placeholder="Выберите роль"
            name={"role"}
            defaultValue={state.inputs?.role}
            aria-describedby="role"
            className={cn(
              "capitalize",
              getFieldError("role") ? "border-red-500" : ""
            )}
          />
          {getFieldError("role") && (
            <p id="role" className="text-sm text-red-500">
              {getFieldError("role")}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="permissions" className="text-sm font-medium">
            Разрешения
          </Label>
          <MultiSelectNativeForm
            id="permissions"
            options={OPTIONS}
            placeholder="Выберите разрешения"
            name={"permissions"}
            defaultValue={
              state.inputs?.permissions
                ? JSON.parse(state.inputs.permissions)
                : undefined
            }
          />
          {getFieldError("permissions") && (
            <p id="permissions" className="text-sm text-red-500">
              {getFieldError("permissions")}
            </p>
          )}
        </div>
      </MotionDivY>
      <SubmitFormButton title="Добавить пользователя" isPending={isPending} />
    </form>
  );
};

export default UserForm;
