import { z } from "zod";


export const OrderFormSchema = z
  .object({
    dateRequest: z.preprocess(
      (val) => (val instanceof Date ? val.toISOString() : val || ""),
      z.string()
    ),
    nameDeal: z.string({
      message: "Введите название сделки",
    }),
    // nameObject: z.string({
    //   message: "Введите название объекта",
    // }),
    // direction: z.enum(
    //   Object.values(DirectionRetail).filter(Boolean) as [string, ...string[]],
    //   {
    //     message: "Выберите направление",
    //   }
    // ),
    // deliveryType: z
    //   .enum(Object.values(DeliveryRetail) as [string, ...string[]])
    //   .optional()
    //   .nullable(),
    contact: z.string(),
    phone: z.string().optional(),
    email: z.string().email().or(z.literal("")),
    manager: z.string(),

    // amountCP: z.string().optional(),
    // delta: z.string().optional(),

    // dealStatus: z.enum(Object.values(StatusRetail) as [string, ...string[]], {
    //   message: "Выберите статус проекта",
    // }),
    comments: z.string(),
    // plannedDateConnection: z.preprocess(
    //   (val) => (val instanceof Date ? val.toISOString() : val || ""),
    //   z.string()
    // ),
    resource: z.string().optional(),
    // contacts: z.array(SingleContactSchema),
  })


export type OrderSchema = z.infer<typeof OrderFormSchema>;
