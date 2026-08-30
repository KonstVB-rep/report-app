import { z } from "zod"
import { DepartmentLabels } from "@/entities/department/lib/constants"
import { DEPARTMENTS, type DepartmentUnion } from "@/entities/department/types"
import type { RoleUnion } from "@/entities/user/types"
import { PERMISSIONS, type PERMISSIONS_UNION, PERMISSIONS_VALUES } from "@/shared/lib/constants"
import { ROLES, RolesUser } from "./objectTypes"

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
  phone: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z
      .string()
      .min(18, "Минимальное количество символов 18")
      .max(18, "Максимальное количество символов 18")
      .optional(),
  ),
  position: z
    .string()
    .min(3, { message: "Должность должна содержать не менее 3 символов" })
    .max(60, { message: "Должность должна содержать не более 60 символов" }),
  department: z.enum(
    Object.keys(DepartmentLabels).filter(Boolean) as [DepartmentUnion, ...DepartmentUnion[]],
    {
      error: "Выберите отдел из списка",
    },
  ),

  role: z.enum(Object.keys(RolesUser).filter(Boolean) as unknown as [RoleUnion, ...RoleUnion[]], {
    message: "Пожалуйста, выберите роль из списка",
  }),
  permissions: z
    .array(z.string())
    .transform((arr) =>
      arr.filter((permission): permission is PERMISSIONS_UNION =>
        Object.values(PERMISSIONS).includes(permission as PERMISSIONS_UNION),
      ),
    )
    .optional(),
  isBlocked: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val === "true" || val === "on"
      }
      return Boolean(val)
    }, z.boolean())
    .default(false),
  emailNotify: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val === "true" || val === "on"
      }
      return Boolean(val)
    }, z.boolean())
    .default(false),
})

export const userFormEditSchema = userFormSchema.extend({
  id: z.string(),
  user_password: z
    .string()
    .min(6, { message: "Пароль должен содержать не менее 6 символов" })
    .max(30, { message: "Пароль должен содержать не более 30 символов" })
    .or(z.literal(""))
    .optional(),
})

export const userUpdateFormSchema = z.object({
  id: z.string().min(1, "ID обязателен"),
  username: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().optional().default(""),
  email: z.string().email("Некорректный email"),
  position: z.string().min(1, "Должность обязательна"),
  department: z.enum(DEPARTMENTS, { message: "Выберите отдел" }),
  role: z.enum(ROLES, { message: "Выберите роль" }),
  permissions: z.array(z.enum(PERMISSIONS_VALUES)),
  isBlocked: z.boolean().default(false),
  emailNotify: z.boolean().default(false),
})
