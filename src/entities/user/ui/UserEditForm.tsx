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
import {  updateUser } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRequest, UserWithdepartmentName } from "../types";
import useStoreUser from "../store/useStoreUser";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import PhoneInput from "@/shared/ui/PhoneInput";

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
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: userEditSchema) => updateUser(data as UserRequest),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["users"],
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
      });
    }
  }, [form, user]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 max-h-[85vh] overflow-y-auto">
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
                    className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500 valid:border-green-500"
                    required
                  />
                </FormControl>
              {
                form.formState.errors.username?.message && (
                  <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                )
              }
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
               {
                form.formState.errors.phone?.message && (
                  <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                )
              }
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
                  <Input
                    placeholder="Введите пароль для пользователя"
                    type="password"
                    {...field}
                    minLength={6}
                    maxLength={30}
                    value={field.value} 
                    onChange={field.onChange} 
                    className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500 valid:border-green-500"
                  />
                </FormControl>
                {
                  form.formState.errors.user_password?.message && (
                    <FormMessage>{form.formState.errors.user_password?.message}</FormMessage>
                  )
                }
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
                    className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500 valid:border-green-500"
                    required
                  />
                </FormControl>
               {
                form.formState.errors.position?.message && (
                  <FormMessage>{form.formState.errors.position?.message}</FormMessage>
                )
               }
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
                {
                  form.formState.errors.department?.message && (
                    <FormMessage>{form.formState.errors.department?.message}</FormMessage>
                  )
                }
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
                {
                  form.formState.errors.role?.message && (
                    <FormMessage>{form.formState.errors.role?.message}</FormMessage>
                  )
                }
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Роль</FormLabel>
                <FormControl>
                  <SelectComponent
                    placeholder="Выберите права"
                    options={Object.entries(PermissionsUser)}
                    classname="invalid:[&:not(:placeholder-shown)]:border-red-500 valid:border-green-500"
                    defaultValue={user?.role}
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
        <SubmitFormButton title="Сохранить" isPending={isPending}/>
      </form>
    </Form>
  );
};

export default UserEditForm;
