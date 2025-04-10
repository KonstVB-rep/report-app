import { z } from "zod";
import {
  DirectionProject,
  DeliveryProject,
  StatusProject,
  DirectionRetail,
  DeliveryRetail,
  StatusRetail,
} from "@prisma/client";

export const SingleContactSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, "Имя обязательно"),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(), 
    position: z.string().nullable().optional(),
  })
  .refine(
    (contact) => contact.phone?.trim() || contact.email?.trim(),
    {
      message: "Укажите либо телефон, либо email",
      path: ["_common"],
    }
  );

export const ContactFormSchema = z.object({
  contacts: z.array(SingleContactSchema),
});

export const ProjectFormSchema = z.object({
  dateRequest: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val || ""),
    z.string()
  ),
  nameDeal: z.string({
    message: "Введите название сделки",
  }),
  nameObject: z.string({
    message: "Введите название объекта",
  }),
  direction: z.enum(
    Object.values(DirectionProject).filter(Boolean) as [string, ...string[]],
    {
      message: "Выберите направление",
    }
  ),
  deliveryType: z
    .enum(Object.values(DeliveryProject) as [string, ...string[]])
    .optional()
    .nullable(),
  contact: z.string(),
  phone: z.string().optional(),
  email: z.string().email().or(z.literal("")), // ✅ Email необязателен
  // additionalContact: z.string().optional(),

  amountCP: z.string().optional(),
  amountWork: z.string().optional(),
  amountPurchase: z.string().optional(),
  delta: z.string().optional(),

  dealStatus: z.enum(Object.values(StatusProject) as [string, ...string[]], {
    message: "Выберите статус проекта",
  }),
  comments: z.string(),
  plannedDateConnection: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val || ""),
    z.string()
  ),
  resource: z.string().optional(),
  contacts: z.array(SingleContactSchema),
});
// refine((data) => {
//   // Сравниваем lastDateConnection и plannedDateConnection
//   const lastDate = new Date(data.lastDateConnection);
//   const plannedDate = new Date(data.plannedDateConnection);

//   // Проверяем, что lastDateConnection не больше plannedDateConnection
//   return lastDate <= plannedDate;
// }, {
//   message: "Дата последнего контакта не может быть позже планируемой даты",
//   path: ["lastDateConnection"], // Указываем поле, к которому относится ошибка
// });

export const RetailFormSchema = z.object({
  dateRequest: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val || ""),
    z.string()
  ),
  nameDeal: z.string({
    message: "Введите название сделки",
  }),
  nameObject: z.string({
    message: "Введите название объекта",
  }),
  direction: z.enum(
    Object.values(DirectionRetail).filter(Boolean) as [string, ...string[]],
    {
      message: "Выберите направление",
    }
  ),
  deliveryType: z
  .enum(Object.values(DeliveryRetail) as [string, ...string[]])
  .optional()
  .nullable(),
  contact: z.string(),
  phone: z.string().optional(),
  email: z.string().email().or(z.literal("")),

  amountCP: z.string().optional(),
  delta: z.string().optional(),

  dealStatus: z.enum(Object.values(StatusRetail) as [string, ...string[]], {
    message: "Выберите статус проекта",
  }),
  comments: z.string(),
  plannedDateConnection: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val || ""),
    z.string()
  ),
  resource: z.string().optional(),
  contacts: z.array(SingleContactSchema),
  
});

export type ProjectSchema = z.infer<typeof ProjectFormSchema>;
export type RetailSchema = z.infer<typeof RetailFormSchema>;
export type ContactSchema = z.infer<typeof ContactFormSchema>;
