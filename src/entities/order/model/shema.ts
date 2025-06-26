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
    email: z.string().email("Некорректный email").or(z.literal("")).optional(),
    manager: z.string(),
    comments: z.string().optional(),
    projectId: z.string().optional(),
    retailId: z.string().optional(),
    dealType: z.string().optional(),
    resource: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasPhone = !!data.phone?.trim();
    const hasEmail = !!data.email?.trim();

    if (!hasPhone && !hasEmail) {
      ctx.addIssue({
        path: ["phone"],
        code: z.ZodIssueCode.custom,
        message: "Укажите телефон или email",
      });
      ctx.addIssue({
        path: ["email"],
        code: z.ZodIssueCode.custom,
        message: "Укажите телефон или email",
      });
    }
  });

export type OrderSchema = z.infer<typeof OrderFormSchema>;
