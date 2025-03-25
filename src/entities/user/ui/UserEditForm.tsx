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
import { Input } from "@/components/ui/input";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import SelectComponent from "@/shared/ui/SelectComponent";
import {
  DepartmentsTitle,
  RolesUser,
  RolesWithDefaultPermissions,
} from "../model/objectTypes";

import { userEditSchema, userFormEditSchema } from "../model/schema";
import { TOAST } from "./Toast";
import { updateUser } from "../api";
import { useMutation } from "@tanstack/react-query";
import { OPTIONS, UserRequest, UserWithdepartmentName } from "../types";
import useStoreUser from "../store/useStoreUser";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import PhoneInput from "@/shared/ui/PhoneInput";
import InputPassword from "@/shared/ui/Inputs/InputPassword";
import { getQueryClient } from "@/app/provider/query-provider";
import MultiSelectComponent from "@/shared/ui/MultiSlectComponent";

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
      permissions: user?.permissions as string[]
    },
  });

  const queryClient = getQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: userEditSchema) => updateUser(data as UserRequest),
    onSuccess: () => {
      setOpen(false);
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ["user", user.id],
          exact: true,
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["depsWithUsers"],
        exact: true,
      });
    },
  });

  const onSubmit = (data: userEditSchema) => {
    TOAST.PROMISE(
      new Promise((resolve, reject) => {
        mutate(data, {
          onSuccess: (data) => {
            resolve(data);
          },
          onError: (error) => {
            reject(error);
          },
        });
      }),
      "Изменения сохранены"
    );
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
        permissions: user.permissions as string[]
      });
    }
  }, [form, user]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid max-h-[85vh] gap-5 overflow-y-auto p-1"
      >
        <div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя пользователя</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите имя пользователя"
                    {...field}
                    minLength={3}
                    maxLength={50}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    required
                  />
                </FormControl>
                {form.formState.errors.username?.message && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.username?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder="Введите телефон пользователя"
                    onAccept={field.onChange}
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.phone?.message && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.phone?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="user_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <InputPassword {...field} required={false} />
                </FormControl>
                {form.formState.errors.user_password?.message && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.user_password?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Должность</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите название должности"
                    {...field}
                    minLength={3}
                    maxLength={60}
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    required
                  />
                </FormControl>
                {form.formState.errors.position?.message && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.position?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
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
                    classname="invalid:[&:not(:placeholder-shown)]:border-red-500 valid:border-green-500"
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
                    classname="invalid:[&:not(:placeholder-shown)]:border-red-500 valid:border-green-500"
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
                      console.log(selected);
                      // const selectedList = selected.map((item) => item.value);
                      // form.setValue("permissions", selectedList);

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
  );
};

export default UserEditForm;
