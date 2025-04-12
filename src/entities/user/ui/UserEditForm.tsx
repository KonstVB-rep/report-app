"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import SelectComponent from "@/shared/ui/SelectForm/SelectComponent";
import {
  DepartmentsTitle,
  RolesUser,
  RolesWithDefaultPermissions,
} from "../model/objectTypes";

import { userEditSchema, userFormEditSchema } from "../model/schema";
import { TOAST } from "./Toast";
import { OPTIONS, UserWithdepartmentName } from "../types";
import useStoreUser from "../store/useStoreUser";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import MultiSelectComponent from "@/shared/ui/MultiSlectComponent";
import { useUpdateUser } from "../hooks/mutate";
import Overlay from "@/shared/ui/Overlay";
import InputFormPassword from "@/shared/ui/Inputs/InputFormPassword";
import InputPhoneForm from "@/shared/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";

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
              placeholder="Введите имя пользователя"
              required
            />

            <InputTextForm
              name="email"
              label="Email"
              control={form.control}
              errorMessage={form.formState.errors.email?.message}
              type="email"
              placeholder="Введите email пользователя"
              required
            />

            <InputPhoneForm
              name="phone"
              label="Телефон"
              control={form.control}
              errorMessage={form.formState.errors.phone?.message}
              placeholder="Введите телефон пользователя"
            />

            <InputFormPassword
              name="user_password"
              label="Пароль"
              control={form.control}
              errorMessage={form.formState.errors.user_password?.message}
              placeholder="Введите пароль для пользователя"
              required
            />

            <InputTextForm
              name="position"
              label="Должность"
              control={form.control}
              errorMessage={form.formState.errors.position?.message}
              placeholder="Введите название должности"
              required
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отдел</FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Выберите отдел"
                      options={Object.entries(DepartmentsTitle)}
                      className="valid:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    />
                  </FormControl>
                  {form.formState.errors.department?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.department?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Выберите роль"
                      options={Object.entries(RolesUser)}
                      className="valid:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        !RolesWithDefaultPermissions.includes(
                          authUser?.role as keyof typeof RolesUser
                        )
                      }
                      required
                    />
                  </FormControl>
                  {form.formState.errors.role?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.role?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
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
