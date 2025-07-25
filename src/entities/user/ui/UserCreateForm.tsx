"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DepartmentLabels } from "@/entities/department/types";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import InputFormPassword from "@/shared/ui/Inputs/InputFormPassword";
import InputPhoneForm from "@/shared/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import MultiSelectComponent from "@/shared/ui/MultiSlectComponent";
import Overlay from "@/shared/ui/Overlay";
import SelectFormField from "@/shared/ui/SelectForm/SelectFormField";
import { TOAST } from "@/shared/ui/Toast";

import { useCreateUser } from "../hooks/mutate";
import { RolesUser } from "../model/objectTypes";
import { userFormSchema, userSchema } from "../model/schema";
import { OPTIONS } from "../types";

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
          className="flex max-h-[85vh] flex-col gap-8 overflow-y-auto px-2 py-8"
        >
          <MotionDivY className="grid gap-1">
            <InputTextForm
              name="username"
              label="Имя пользователя"
              control={form.control}
              errorMessage={form.formState.errors.username?.message}
              minLength={3}
              maxLength={50}
              placeholder="Введите имя пользователя"
              className="w-ful invalid:[&:not(:placeholder-shown)]:border-red-500"
              required
            />

            <InputTextForm
              name="email"
              label="Email"
              control={form.control}
              errorMessage={form.formState.errors.email?.message}
              type="email"
              className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500"
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
              placeholder="Пароль"
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
              options={Object.entries(DepartmentLabels)}
              placeholder="Выберите отдел"
              required
            />

            <SelectFormField<userSchema>
              name="role"
              label="Роль"
              control={form.control}
              errorMessage={form.formState.errors.role?.message}
              options={Object.entries(RolesUser)}
              placeholder="Выберите роль"
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
          <SubmitFormButton title="Добавить" isPending={isPending} />
        </form>
      </Form>
    </>
  );
};

export default UserCreateForm;
