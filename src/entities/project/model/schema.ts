import { Delivery, Status } from "@prisma/client";
import { z } from "zod";
import { Directions } from "../types";

export const ProjectFormSchema = z.object({
  nameObject: z.string({
    message: "Введите название объекта",
  }),
  equipment_type: z.string({
    message: "Выберите тип оборудования",
  }),
  direction: z.enum(Object.values(Directions) as [string, ...string[]], {
    message: "Выберите направление",
  }),
  deliveryType: z.enum(Object.values(Delivery) as [string, ...string[]], {
    message: "Выберите Тип поставки",
  }),
  contact: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  amountCo: z.string().optional(),
  delta: z.string().optional(),
  project_status: z.enum(Object.values(Status) as [string, ...string[]], {
    message: "Выберите статус проекта",
  }),
  comments: z.string(),
  lastDateConnection: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string({
      message: "Выберите дату",
    })
  ),
  plannedDateConnection: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string({
      message: "Выберите дату",})
  ),
})
// .refine((data) => {
//   // Сравниваем lastDateConnection и plannedDateConnection
//   const lastDate = new Date(data.lastDateConnection);
//   const plannedDate = new Date(data.plannedDateConnection);

//   // Проверяем, что lastDateConnection не больше plannedDateConnection
//   return lastDate <= plannedDate;
// }, {
//   message: "Дата последнего контакта не может быть позже планируемой даты",
//   path: ["lastDateConnection"], // Указываем поле, к которому относится ошибка
// });

export type ProjectSchema = z.infer<typeof ProjectFormSchema>;