import { Delivery, Status } from "@prisma/client";
import { z } from "zod";
import { DirectionProjects } from "../types";

export const ProjectFormSchema = z.object({
  nameDeal: z.string({
    message: "Введите название сделки",
  }),
  nameObject: z.string({
    message: "Введите название объекта",
  }),
  equipmentType: z.string({
    message: "Укажите тип оборудования",
  }).optional(),
  direction: z.enum(
    Object.values(DirectionProjects).filter(Boolean) as [string, ...string[]],
    {
      message: "Выберите направление",
    }
  ),
  deliveryType: z.enum(Object.values(Delivery) as [string, ...string[]])
  .or(z.literal(""))
  .optional(),
  contact: z.string(),
  phone: z.string().optional(),
  email: z.string().email().or(z.literal("")), // ✅ Email необязателен
  additionalСontact: z.string().optional(),

  amountCP: z.string().optional(),
  amountWork: z.string().optional(),
  amountPurchase: z.string().optional(),
  delta: z.string().optional(),

  projectStatus: z.enum(Object.values(Status) as [string, ...string[]], {
    message: "Выберите статус проекта",
  }),
  comments: z.string(),
  plannedDateConnection: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val || ""),
    z.string()
  ),
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
  nameDeal: z.string({
    message: "Введите название сделки",
  }),
  nameObject: z.string({
    message: "Введите название объекта",
  }),
  equipmentType: z.string({
    message: "Укажите тип оборудования",
  }).optional(),
  direction: z.enum(
    Object.values(DirectionProjects).filter(Boolean) as [string, ...string[]],
    {
      message: "Выберите направление",
    }
  ),
  deliveryType: z.enum(Object.values(Delivery) as [string, ...string[]])
  .or(z.literal(""))
  .optional(),
  contact: z.string(),
  phone: z.string().optional(),
  email: z.string().email().or(z.literal("")), // ✅ Email необязателен
  additionalСontact: z.string().optional(),

  amountCP: z.string().optional(),
  delta: z.string().optional(),

  projectStatus: z.enum(Object.values(Status) as [string, ...string[]], {
    message: "Выберите статус проекта",
  }),
  comments: z.string(),
  plannedDateConnection: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val || ""),
    z.string()
  ),
});

export type ProjectSchema = z.infer<typeof ProjectFormSchema>;
export type RetailSchema = z.infer<typeof RetailFormSchema>;