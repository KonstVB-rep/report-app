import {
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client";

import { z } from "zod";

import { SingleContactFormSchema } from "@/entities/contact/model/schema";

export const ProjectFormSchema = z
  .object({
    id: z.string().optional(),
    dateRequest: z.preprocess((val) => {
      if (val instanceof Date) return val.toISOString();
      if (!val) return "";
      return val;
    }, z.string()),
    nameDeal: z.string({
      error: "Введите название сделки",
    }),
    nameObject: z.string({
      error: "Введите название объекта",
    }),
    direction: z.enum(
      Object.values(DirectionProject).filter(Boolean) as [string, ...string[]],
      {
        error: "Выберите направление",
      }
    ),
    deliveryType: z
      .enum(Object.values(DeliveryProject) as [string, ...string[]], {
        error: "Выберите тип поставки",
      })
      .optional()
      .nullable(),
    contact: z.string(),
    phone: z.string().optional(),
    email: z.email("Некорректный email").or(z.literal("")).optional(),

    amountCP: z.string().optional(),
    amountWork: z.string().optional(),
    amountPurchase: z.string().optional(),
    delta: z.string().optional(),

    dealStatus: z.enum(Object.values(StatusProject) as [string, ...string[]], {
      message: "Выберите статус проекта",
    }),
    comments: z.string(),
    plannedDateConnection: z.preprocess((val) => {
      if (val instanceof Date) return val.toISOString();
      if (!val) return null;
      return val;
    }, z.string().nullable().optional()),
    orderId: z.string().nullable().optional(),
    resource: z.string().nullable().optional(),
    contacts: z.array(SingleContactFormSchema),
    managersIds: z.array(
      z.object({
        userId: z.string(),
      })
    ),
  })
  .check((ctx) => {
    const data = ctx.value;

    if (
      data.dealStatus !== StatusProject.REJECT &&
      !data.plannedDateConnection?.trim()
    ) {
      ctx.issues.push({
        code: "custom",
        message: "Укажите планируемую дату подключения",
        path: ["plannedDateConnection"],
        input: data.plannedDateConnection,
      });
    }

    if (data.dealStatus !== StatusProject.REJECT && !data.resource?.trim()) {
      ctx.issues.push({
        code: "custom",
        message: "Укажите ресурс",
        path: ["resource"],
        input: data.resource,
      });
    }

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

export const RetailFormSchema = z
  .object({
    id: z.string().optional(),
    dateRequest: z.preprocess((val) => {
      if (val instanceof Date) return val.toISOString();
      if (!val) return "";
      return val;
    }, z.string()),
    nameDeal: z
      .string({
        error: "Название сделки должно быть строкой",
      })
      .min(1, "Название объекта не может быть пустым"),
    nameObject: z
      .string({
        error: "Название объекта должно быть строкой",
      })
      .min(1, "Название объекта не может быть пустым"),
    direction: z.enum(
      Object.values(DirectionRetail).filter(Boolean) as [string, ...string[]],
      {
        error: "Выберите направление",
      }
    ),
    deliveryType: z
      .enum(Object.values(DeliveryRetail) as [string, ...string[]], {
        error: "Выберите тип поставки",
      })
      .optional()
      .nullable(),
    contact: z.string(),
    phone: z.string().optional(),
    email: z.email("Некорректный email").or(z.literal("")).optional(),

    amountCP: z.string().optional(),
    delta: z.string().optional(),

    dealStatus: z.enum(Object.values(StatusRetail) as [string, ...string[]], {
      error: "Выберите статус проекта",
    }),
    comments: z.string(),
    plannedDateConnection: z.preprocess((val) => {
      if (val instanceof Date) return val.toISOString();
      if (!val) return "";
      return val;
    }, z.string()),
    orderId: z.string().nullable().optional(),
    resource: z.string().optional(),
    contacts: z.array(SingleContactFormSchema),
    managersIds: z.array(
      z.object({
        userId: z.string(),
      })
    ),
  })
  .check((ctx) => {
    const data = ctx.value;

    if (
      data.dealStatus !== StatusProject.REJECT &&
      !data.plannedDateConnection?.trim()
    ) {
      ctx.issues.push({
        code: "custom",
        message: "Укажите планируемую дату подключения",
        path: ["plannedDateConnection"],
        input: data.plannedDateConnection,
      });
    }

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

export type ProjectSchema = z.infer<typeof ProjectFormSchema>;
export type RetailSchema = z.infer<typeof RetailFormSchema>;
