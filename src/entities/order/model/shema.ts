import { z } from "zod";

export const OrderFormSchema = z
  .object({
    dateRequest: z.preprocess(
      (val) => (val instanceof Date ? val.toISOString() : val),
      z.string().min(1)
    ),
    nameDeal: z.string({
      message: "Введите название сделки",
    }),
    contact: z.string().optional(),
    phone: z.string().optional(),
    email: z.email("Некорректный email").or(z.literal("")).optional(),
    manager: z.string(),
    comments: z.string().nullable().optional(),
    projectId: z.string().optional(),
    retailId: z.string().optional(),
    dealType: z.string().optional(),
    resource: z.string().optional(),
  })
  .check((ctx) => {
    const data = ctx.value;
    const hasPhone = !!data.phone?.trim();
    const hasEmail = !!data.email?.trim();

    if (!hasPhone && !hasEmail) {
      ctx.issues.push({
        code: "custom",
        message: "Укажите телефон или email",
        path: ["phone"],
        input: data.phone,
      });
      ctx.issues.push({
        code: "custom",
        message: "Укажите телефон или email",
        path: ["email"],
        input: data.email,
      });
    }
  });

export type OrderSchema = z.infer<typeof OrderFormSchema>;
