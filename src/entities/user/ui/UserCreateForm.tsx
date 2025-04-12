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
// import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import SelectComponent from "@/shared/ui/SelectForm/SelectComponent";
import { DepartmentsTitle, RolesUser } from "../model/objectTypes";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import { TOAST } from "./Toast";
import { userFormSchema, userSchema } from "../model/schema";
// import PhoneInput from "@/shared/ui/Inputs/PhoneInput";
import MultiSelectComponent from "@/shared/ui/MultiSlectComponent";
import { DepartmentTypeName, OPTIONS } from "../types";
// import InputPassword from "@/shared/ui/Inputs/InputPassword";
import { useCreateUser } from "../hooks/mutate";
import Overlay from "@/shared/ui/Overlay";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import InputPhoneForm from "@/shared/ui/Inputs/InputPhoneForm";
import InputFormPassword from "@/shared/ui/Inputs/InputFormPassword";
import SelectFormField from "@/shared/ui/SelectForm/SelectFormField";

const UserCreateForm = () => {
  const { mutateAsync, isPending } = useCreateUser();

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
    try {
      TOAST.PROMISE(mutateAsync(data), "Пользователь сохранен");
      form.reset();
      form.setValue("phone", "");
    } catch (error) {
      console.error("Error creating user:", error);
      TOAST.ERROR("Ошибка при создании пользователя");
    }
  };

  return (
    <>
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[85vh] flex-col gap-8 overflow-y-auto p-1"
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

            <SelectFormField<userSchema>
              name="department"
              label="Отдел"
              control={form.control}
              errorMessage={form.formState.errors.department?.message}
              options={Object.entries(DepartmentsTitle)}
              required
            />
            

            {/* <FormField
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
            /> */}
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
                      value={field.value || ""}
                      onValueChange={(selected) => {
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
    </>
  );
};

export default UserCreateForm;
