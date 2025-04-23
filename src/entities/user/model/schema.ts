import { z } from "zod";

import { DepartmentLabels } from "@/entities/department/types";

import { PermissionUser, RolesUser } from "./objectTypes";

export const userFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Имя пользователя должно содержать не менее 3 символов",
    })
    .max(50, {
      message: "Имя пользователя должно содержать не более 50 символов",
    }),
  user_password: z
    .string()
    .min(6, { message: "Пароль должен содержать не менее 6 символов" })
    .max(30, { message: "Пароль должен содержать не более 30 символов" }),
  email: z.string().email(),
  phone: z
    .string()
    .min(16, "Минимальное количество символов 16")
    .max(16, "Максимальное количество символов 16"),
  position: z
    .string()
    .min(3, { message: "Должность должна содержать не менее 3 символов" })
    .max(60, { message: "Должность должна содержать не более 60 символов" }),
  department: z.enum(Object.keys(DepartmentLabels) as [string, ...string[]]),
  role: z.enum(Object.keys(RolesUser) as [string, ...string[]]),
  permissions: z
    .array(z.enum(Object.keys(PermissionUser) as [string, ...string[]]))
    .optional(),
});

export const userFormEditSchema = userFormSchema.merge(
  z.object({
    user_password: z
      .string()
      .min(6, { message: "Пароль должен содержать не менее 6 символов" })
      .max(30, { message: "Пароль должен содержать не более 30 символов" })
      .or(z.literal(""))
      .optional(),
  })
);

export type userEditSchema = z.infer<typeof userFormEditSchema>;
export type userSchema = z.infer<typeof userFormSchema>;
