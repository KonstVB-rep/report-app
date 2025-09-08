import { DepartmentEnum, PermissionEnum, Role } from "@prisma/client";

import { z } from "zod";

import { DepartmentLabels } from "@/entities/department/types";

import { RolesUser } from "./objectTypes";

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
  email: z.email("Некорректный email"),
  phone: z.string().min(18, "Минимальное количество символов 18"),
  position: z
    .string()
    .min(3, { message: "Должность должна содержать не менее 3 символов" })
    .max(60, { message: "Должность должна содержать не более 60 символов" }),
   department: z.enum(
         Object.keys(DepartmentLabels).filter(Boolean) as [DepartmentEnum, ...DepartmentEnum[]],
         {
           error: "Выберите отдел из списка",
         }
       ),

  role:  z.enum(
         Object.keys(RolesUser).filter(Boolean) as unknown as [Role, ...Role[]], {
    message: "Пожалуйста, выберите роль из списка",
  }),
  permissions: z
    .array(z.string())
    .transform((arr) =>
      arr.filter((permission): permission is PermissionEnum =>
        Object.values(PermissionEnum).includes(permission as PermissionEnum)
      )
    )
    .optional(),
});

export const userFormEditSchema = userFormSchema.extend({
  id: z.string(), 
  user_password: z
    .string()
    .min(6, { message: "Пароль должен содержать не менее 6 символов" })
    .max(30, { message: "Пароль должен содержать не более 30 символов" })
    .or(z.literal(""))
    .optional(),
});

export type UserEditSchema = z.infer<typeof userFormEditSchema>;
export type UserSchema = z.infer<typeof userFormSchema>;
