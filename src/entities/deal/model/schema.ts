import {
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client";

import { z } from "zod";

export const SingleContactSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, "Имя обязательно"),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    position: z.string().nullable().optional(),
  })
  .refine((contact) => contact.phone?.trim() || contact.email?.trim(), {
    message: "Укажите либо телефон, либо email",
    path: ["_common"],
  });

export const ContactFormSchema = z.object({
  contacts: z.array(SingleContactSchema),
});

export const ProjectFormSchema = z
  .object({
    id: z.string().optional(),
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
    email: z.string().email("Некорректный email").or(z.literal("")).optional(),

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
    orderId: z.string().nullable().optional(),
    resource: z.string().optional(),
    contacts: z.array(SingleContactSchema),
    managersIds: z.array(
      z.object({
        userId: z.string(),
      })
    ),
  })
  .superRefine((data, ctx) => {
    if (
      data.dealStatus !== StatusProject.REJECT &&
      !data.plannedDateConnection?.trim()
    ) {
      ctx.addIssue({
        path: ["plannedDateConnection"],
        code: z.ZodIssueCode.custom,
        message: "Укажите планируемую дату подключения",
      });
    }
    const hasPhone = !!data.phone?.trim();
    const hasEmail = !!data.email?.trim();

    if (!hasPhone && !hasEmail) {
      // Добавляем ошибки для обоих полей
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

export const RetailFormSchema = z
  .object({
    id: z.string().optional(),
    dateRequest: z.preprocess(
      (val) => (val instanceof Date ? val.toISOString() : val || ""),
      z.string()
    ),
    nameDeal: z
      .string({
        required_error: "Введите название сделки", // Если undefined
        invalid_type_error: "Название сделки должно быть строкой", // Если не string
      })
      .min(1, "Название объекта не может быть пустым"),
    nameObject: z
      .string({
        required_error: "Введите название объекта", // Если undefined
        invalid_type_error: "Название объекта должно быть строкой", // Если не string
      })
      .min(1, "Название объекта не может быть пустым"),
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
    email: z.string().email("Некорректный email").or(z.literal("")).optional(),

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
    orderId: z.string().nullable().optional(),
    resource: z.string().optional(),
    contacts: z.array(SingleContactSchema),
    managersIds: z.array(
      z.object({
        userId: z.string(),
      })
    ),
  })
  .superRefine((data, ctx) => {
    if (
      data.dealStatus !== StatusRetail.REJECT &&
      !data.plannedDateConnection?.trim()
    ) {
      ctx.addIssue({
        path: ["plannedDateConnection"],
        code: z.ZodIssueCode.custom,
        message: "Укажите планируемую дату подключения",
      });
    }

    const hasPhone = !!data.phone?.trim();
    const hasEmail = !!data.email?.trim();

    if (!hasPhone && !hasEmail) {
      // Добавляем ошибки для обоих полей
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

export type ProjectSchema = z.infer<typeof ProjectFormSchema>;
export type RetailSchema = z.infer<typeof RetailFormSchema>;
export type ContactSchema = z.infer<typeof ContactFormSchema>;
