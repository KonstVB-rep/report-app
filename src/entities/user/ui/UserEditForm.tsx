"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import InputFormPassword from "@/shared/ui/Inputs/InputFormPassword";
import InputPhoneForm from "@/shared/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import MultiSelectComponent from "@/shared/ui/MultiSlectComponent";
import Overlay from "@/shared/ui/Overlay";
import SelectFormField from "@/shared/ui/SelectForm/SelectFormField";
import { TOAST } from "@/shared/ui/Toast";

import { useUpdateUser } from "../hooks/mutate";
import {
  DepartmentsTitle,
  RolesUser,
  RolesWithDefaultPermissions,
} from "../model/objectTypes";
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

  const form = useForm<userEditSchema>({
    resolver: zodResolver(userFormEditSchema),
    defaultValues: {
      username: user?.username ?? "",
      phone: user?.phone ?? "",
      user_password: "",
      email: user?.email ?? "",
      position: user?.position ?? "",
      department: user?.departmentName as keyof typeof DepartmentsTitle,
      role: user?.role as keyof typeof RolesUser,
      permissions: user?.permissions as string[],
    },
  });

  const { mutateAsync, isPending } = useUpdateUser(user!, setOpen);

  const onSubmit = (data: userEditSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Изменения сохранены");
  };

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        phone: user.phone,
        position: user.position,
        department: user.departmentName as keyof typeof DepartmentsTitle,
        role: user.role as keyof typeof RolesUser,
        permissions: user.permissions as string[],
      });
    }
  }, [form, user]);

  return (
    <>
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid max-h-[85vh] gap-5 overflow-y-auto p-1"
        >
          <div className="grid gap-1">
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
              className="w-full valid:[&:not(:placeholder-shown)]:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
              placeholder="Введите пароль для пользователя"
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
              options={Object.entries(DepartmentsTitle)}
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
          </div>
          <SubmitFormButton title="Сохранить" isPending={isPending} />
        </form>
      </Form>
    </>
  );
};

export default UserEditForm;
