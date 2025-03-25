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
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import SelectComponent from "@/shared/ui/SelectComponent";
import { DepartmentsTitle, RolesUser } from "../model/objectTypes";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import { TOAST } from "./Toast";
import { userFormSchema, userSchema } from "../model/schema";
import PhoneInput from "@/shared/ui/PhoneInput";
import MultiSelectComponent from "@/shared/ui/MultiSlectComponent";
import {
  DepartmentTypeName,
  OPTIONS,
} from "../types";
import InputPassword from "@/shared/ui/Inputs/InputPassword";
import { useCreateUser } from "../hooks/mutate";

const UserCreateForm = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {

  const { mutate, isPending } = useCreateUser(setOpen)

  const form = useForm<userSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      user_password: "",
      position: "",
      department: undefined,
      role: undefined,
      permissions: [],
    },
  });

  const onSubmit = (data: userSchema) => {
    TOAST.PROMISE(
      new Promise((resolve, reject) => {
        mutate(data, {
          onSuccess: (data) => {
            resolve(data); // Разрешаем промис при успехе
          },
          onError: (error) => {
            reject(error); // Отклоняем промис при ошибке
          },
        });
      }),
      "Пользователь сохранен"
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-h-[85vh] flex-col gap-8 overflow-y-auto p-1"
      >
        <div className="grid gap-2">
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
                    className="w-full valid:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                    required
                  />
                </FormControl>
                {form.formState.errors.username && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.username.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите email пользователя"
                    {...field}
                    type="email"
                    className="w-full valid:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                    required
                  />
                </FormControl>
                {form.formState.errors.email && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.email.message}
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
                    required={true}
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.phone && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.phone.message}
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
                  <InputPassword
                    placeholder="Введите пароль для пользователя"
                    {...field}
                    minLength={6}
                    maxLength={30}
                    required
                  />
                </FormControl>
                {form.formState.errors.user_password && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.user_password.message}
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
                    maxLength={30}
                    className="w-full valid:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                    required
                  />
                </FormControl>
                {form.formState.errors.position && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.position.message}
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
                    value={field.value || ""}
                    onValueChange={(selected) =>
                      form.setValue(
                        "department",
                        selected as DepartmentTypeName
                      )
                    }
                    required
                  />
                </FormControl>
                {form.formState.errors.department && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.department.message}
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
                    value={field.value || ""}
                    onValueChange={(selected) => {
                      console.log(selected, "selected");
                      // Убедитесь, что selected передается в нужном формате
                      form.setValue("role", selected);
                    }}
                    required
                  />
                </FormControl>
                {form.formState.errors.role && (
                  <FormMessage className="text-red-500">
                    {form.formState.errors.role.message}
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
        <SubmitFormButton title="Добавить" isPending={isPending} />
      </form>
    </Form>
  );
};

export default UserCreateForm;
