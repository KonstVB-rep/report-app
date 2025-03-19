
import { z } from "zod";
import { DirectionProject, DeliveryProject, StatusProject, DirectionRetail, DeliveryRetail, StatusRetail } from "@prisma/client";

export const ProjectFormSchema = z.object({
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
    .optional(),
  contact: z.string(),
  phone: z.string().optional(),
  email: z.string().email().or(z.literal("")), // ✅ Email необязателен
  additionalContact: z.string().optional(),

  amountCP: z.string().optional(),
  amountWork: z.string().optional(),
  amountPurchase: z.string().optional(),
  delta: z.string().optional(),

  projectStatus: z.enum(Object.values(StatusProject) as [string, ...string[]], {
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
  direction: z.enum(
    Object.values(DirectionRetail).filter(Boolean) as [string, ...string[]],
    {
      message: "Выберите направление",
    }
  ),
  deliveryType: z
  .enum(Object.values(DeliveryRetail) as [string, ...string[]])
  .optional(),
  contact: z.string(),
  phone: z.string().optional(),
  email: z.string().email().or(z.literal("")),
  additionalContact: z.string().optional(),

  amountCP: z.string().optional(),
  delta: z.string().optional(),

  projectStatus: z.enum(
    Object.values(StatusRetail) as [string, ...string[]],
    {
      message: "Выберите статус проекта",
    }
  ),
  comments: z.string(),
  plannedDateConnection: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val || ""),
    z.string()
  ),
});

export type ProjectSchema = z.infer<typeof ProjectFormSchema>;
export type RetailSchema = z.infer<typeof RetailFormSchema>;
