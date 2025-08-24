"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { DepartmentLabels } from "@/entities/department/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import InputFormPassword from "@/shared/custom-components/ui/Inputs/InputFormPassword";
import InputPhoneForm from "@/shared/custom-components/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import MultiSelectComponent from "@/shared/custom-components/ui/MultiSlectComponent";
import Overlay from "@/shared/custom-components/ui/Overlay";
import SelectFormField from "@/shared/custom-components/ui/SelectForm/SelectFormField";
import { TOAST } from "@/shared/custom-components/ui/Toast";

import { useUpdateUser } from "../hooks/mutate";
import { RolesUser, RolesWithDefaultPermissions } from "../model/objectTypes";
import { userEditSchema, userFormEditSchema } from "../model/schema";
import useStoreUser from "../store/useStoreUser";
import { OPTIONS, UserWithdepartmentName } from "../types";

const UserEditForm = ({
  user,
  setOpen,
}: {
  user: UserWithdepartmentName | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { authUser } = useStoreUser();

  console.log(user?.permissions, "user?.permissions");

  const form = useForm<userEditSchema>({
    resolver: zodResolver(userFormEditSchema),
    defaultValues: {
      username: user?.username ?? "",
      phone: user?.phone ?? "",
      user_password: "",
      email: user?.email ?? "",
      position: user?.position ?? "",
      department: user?.departmentName as keyof typeof DepartmentLabels,
      role: user?.role as keyof typeof RolesUser,
      permissions: user?.permissions as string[],
    },
  });

  const { mutateAsync, isPending } = useUpdateUser(user!, setOpen);

  const onSubmit = (data: userEditSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Изменения сохранены");
  };

  const { reset } = form;

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        phone: user.phone,
        position: user.position,
        department: user.departmentName as keyof typeof DepartmentLabels,
        role: user.role as keyof typeof RolesUser,
        permissions: user.permissions as string[],
      });
    }
  }, [reset, user]);

  return (
    <>
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid max-h-[85vh] gap-5 overflow-y-auto p-1"
        >
          <MotionDivY className="grid gap-1">
            <InputTextForm
              name="username"
              label="Имя пользователя"
              control={form.control}
              errorMessage={form.formState.errors.username?.message}
              minLength={3}
              maxLength={50}
              className="w-full valid:[&:not(:placeholder-shown)]:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
              placeholder="Введите имя пользователя"
              required
            />

            <InputTextForm
              name="email"
              label="Email"
              control={form.control}
              errorMessage={form.formState.errors.email?.message}
              type="email"
              className="w-full valid:[&:not(:placeholder-shown)]:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
              placeholder="Введите email пользователя"
              required
            />

            <InputPhoneForm
              name="phone"
              label="Телефон"
              control={form.control}
              errorMessage={form.formState.errors.phone?.message}
              placeholder="Введите телефон пользователя"
              required={true}
            />

            <InputFormPassword
              name="user_password"
              label="Пароль"
              control={form.control}
              errorMessage={form.formState.errors.user_password?.message}
              className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500"
              placeholder="Введите пароль"
            />

            <InputTextForm
              name="position"
              label="Должность"
              control={form.control}
              errorMessage={form.formState.errors.position?.message}
              placeholder="Введите название должности"
              required
            />

            <SelectFormField<userEditSchema>
              name="department"
              label="Отдел"
              control={form.control}
              errorMessage={form.formState.errors.department?.message}
              options={Object.entries(DepartmentLabels)}
              placeholder="Выберите отдел"
              required
            />

            <SelectFormField<userEditSchema>
              name="role"
              label="Роль"
              control={form.control}
              errorMessage={form.formState.errors.role?.message}
              options={Object.entries(RolesUser)}
              placeholder="Выберите роль"
              disabled={
                !RolesWithDefaultPermissions.includes(
                  authUser?.role as keyof typeof RolesUser
                )
              }
              required
            />
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Разрешения/Права</FormLabel>
                  <FormControl>
                    <MultiSelectComponent
                      options={OPTIONS}
                      placeholder="Установите разрешения"
                      {...field}
                      onValueChange={(selected) => {
                        form.setValue("permissions", selected);
                      }}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.permissions?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </MotionDivY>
          <SubmitFormButton title="Сохранить" isPending={isPending} />
        </form>
      </Form>
    </>
  );
};

export default UserEditForm;
