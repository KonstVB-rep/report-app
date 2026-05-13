import {
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client"
import { z } from "zod"
import { SingleContactFormSchema } from "@/entities/contact/model/schema"

// export const ProjectFormSchema = z
//   .object({
//     id: z.string().optional(),
//     dateRequest: z.preprocess((val) => {
//       if (val instanceof Date) return val.toISOString();
//       if (!val) return "";
//       return val;
//     }, z.string()),
//     nameDeal: z.string({
//       error: "Введите название сделки",
//     }),
//     nameObject: z.string({
//       error: "Введите название объекта",
//     }),
//     inn: z.preprocess(
//       (val) => (val === "" ? null : val),
//       z
//         .string()
//         .regex(/^\d{10,12}$/, "ИНН должен содержать только цифры")
//         .refine((val) => val.length === 10 || val.length === 12, {
//           message: "ИНН должен содержать 10 (юрлицо) или 12 (физлицо) цифр",
//         })
//         .nullable(),
//     ),
//     direction: z.enum(
//       Object.values(DirectionProject).filter(Boolean) as [string, ...string[]],
//       {
//         error: "Выберите направление",
//       },
//     ),
//     deliveryType: z
//       .enum(Object.values(DeliveryProject) as [string, ...string[]], {
//         error: "Выберите тип поставки",
//       })
//       .optional()
//       .nullable(),
//     contact: z.string(),
//     phone: z.string().optional(),
//     email: z.email("Некорректный email").or(z.literal("")).optional(),

//     amountCP: z.string().optional(),
//     amountWork: z.string().optional(),
//     amountPurchase: z.string().optional(),
//     delta: z.string().optional(),

//     dealStatus: z.enum(Object.values(StatusProject) as [string, ...string[]], {
//       message: "Выберите статус проекта",
//     }),
//     comments: z.string(),
//     lastDateConnection: z.preprocess((val) => {
//       if (val instanceof Date) return val.toISOString();
//       if (!val) return "";
//       return val;
//     }, z.string()),
//     commentsLastConnection: z.string(),
//     plannedDateConnection: z.preprocess((val) => {
//       if (val instanceof Date) return val.toISOString();
//       if (!val) return null;
//       return val;
//     }, z.string().nullable().optional()),
//     orderId: z.string().nullable().optional(),
//     resource: z.string().nullable().optional(),
//     contacts: z.array(SingleContactFormSchema),
//     managersIds: z.array(
//       z.object({
//         userId: z.string(),
//       }),
//     ),
//   })
//   .check((ctx) => {
//     const data = ctx.value;

//     if (
//       data.dealStatus !== StatusProject.REJECT &&
//       !data.plannedDateConnection?.trim()
//     ) {
//       ctx.issues.push({
//         code: "custom",
//         message: "Укажите планируемую дату подключения",
//         path: ["plannedDateConnection"],
//         input: data.plannedDateConnection,
//       });
//     }

//     if (data.dealStatus !== StatusProject.REJECT && !data.resource?.trim()) {
//       ctx.issues.push({
//         code: "custom",
//         message: "Укажите ресурс",
//         path: ["resource"],
//         input: data.resource,
//       });
//     }

//     const hasPhone = !!data.phone?.trim();
//     const hasEmail = !!data.email?.trim();

//     if (!hasPhone && !hasEmail) {
//       ctx.issues.push({
//         code: "custom",
//         message: "Укажите телефон или email",
//         path: ["phone"],
//         input: data.phone,
//       });

//       ctx.issues.push({
//         code: "custom",
//         message: "Укажите телефон или email",
//         path: ["email"],
//         input: data.email,
//       });
//     }
//   });

export const ProjectFormSchema = z
  .object({
    id: z.string().optional(),
    // Единственное всегда обязательное поле
    dateRequest: z.preprocess(
      (val) => {
        if (val instanceof Date) return val.toISOString()
        if (!val) return ""
        return val
      },
      z.string().min(1, "Укажите дату запроса"),
    ),
    nameDeal: z.string().optional(),
    nameObject: z.string().optional(),
    inn: z.preprocess(
      (val) => (val === "" ? null : val),
      z
        .string()
        .regex(/^\d{10,12}$/, "ИНН должен содержать только цифры")
        .refine((val) => !val || val.length === 10 || val.length === 12, {
          message: "ИНН должен содержать 10 или 12 цифр",
        })
        .nullable()
        .optional(),
    ),
    direction: z
      .enum(Object.values(DirectionProject).filter(Boolean) as [string, ...string[]], {
        error: "Выберите направление",
      })
      .optional(),
    deliveryType: z
      .enum(Object.values(DeliveryProject) as [string, ...string[]])
      .optional()
      .nullable(),
    contact: z.string().optional(),
    phone: z.string().optional(),
    email: z.email("Некорректный email").or(z.literal("")).optional(),

    amountCP: z.string().optional(),
    amountWork: z.string().optional(),
    amountPurchase: z.string().optional(),
    delta: z.string().optional(),

    dealStatus: z.enum(Object.values(StatusProject) as [string, ...string[]], {
      message: "Выберите статус проекта",
    }),
    comments: z.string().optional(),
    lastDateConnection: z.preprocess((val) => {
      if (val instanceof Date) return val.toISOString()
      if (!val) return ""
      return val
    }, z.string().optional()),
    commentsLastConnection: z.string().optional(),
    plannedDateConnection: z.preprocess((val) => {
      if (val instanceof Date) return val.toISOString()
      if (!val) return null
      return val
    }, z.string().nullable().optional()),
    orderId: z.string().nullable().optional(),
    resource: z.string().nullable().optional(),
    contacts: z.array(SingleContactFormSchema).optional().default([]),
    managersIds: z
      .array(
        z.object({
          userId: z.string(),
        }),
      )
      .optional()
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.dealStatus === "REQUEST") {
      return
    }

    const requiredFields: { key: keyof typeof data; label: string }[] = [
      { key: "nameDeal", label: "Введите название сделки" },
      { key: "nameObject", label: "Введите название объекта" },
      { key: "direction", label: "Выберите направление" },
      { key: "contact", label: "Укажите контактное лицо" },
      { key: "commentsLastConnection", label: "Введите комментарий" },
      { key: "dealStatus", label: "Выберите статус проекта" },
      { key: "contacts", label: "Добавьте хотя бы одного контакта" },
      { key: "deliveryType", label: "Выберите тип доставки" },
    ]

    requiredFields.forEach(({ key, label }) => {
      const value = data[key]
      if (!value || (typeof value === "string" && !value.trim())) {
        ctx.addIssue({
          code: "custom",
          message: label,
          path: [key],
          input: value,
        })
      }
    })

    if (data.dealStatus !== StatusProject.REJECT) {
      if (!data.plannedDateConnection?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Укажите планируемую дату подключения",
          path: ["plannedDateConnection"],
          input: data.plannedDateConnection,
        })
      }

      if (!data.resource?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Укажите ресурс",
          path: ["resource"],
          input: data.resource,
        })
      }
    }

    const hasPhone = !!data.phone?.trim()
    const hasEmail = !!data.email?.trim()

    if (!hasPhone && !hasEmail) {
      const msg = "Укажите телефон или email"
      ctx.addIssue({
        code: "custom",
        message: msg,
        path: ["phone"],
      })
      ctx.addIssue({
        code: "custom",
        message: msg,
        path: ["email"],
      })
    }
  })

// export const RetailFormSchema = z
//   .object({
//     id: z.string().optional(),
//     dateRequest: z.preprocess((val) => {
//       if (val instanceof Date) return val.toISOString();
//       if (!val) return "";
//       return val;
//     }, z.string()),
//     nameDeal: z
//       .string({
//         error: "Название сделки должно быть строкой",
//       })
//       .min(1, "Название объекта не может быть пустым"),
//     nameObject: z
//       .string({
//         error: "Название объекта должно быть строкой",
//       })
//       .min(1, "Название объекта не может быть пустым"),
//     inn: z.preprocess(
//       (val) => (val === "" ? null : val),
//       z
//         .string()
//         .regex(/^\d{10,12}$/, "ИНН должен содержать только цифры")
//         .refine((val) => val.length === 10 || val.length === 12, {
//           message: "ИНН должен содержать 10 (юрлицо) или 12 (физлицо) цифр",
//         })
//         .nullable(),
//     ),
//     direction: z.enum(
//       Object.values(DirectionRetail).filter(Boolean) as [string, ...string[]],
//       {
//         error: "Выберите направление",
//       },
//     ),
//     deliveryType: z
//       .enum(Object.values(DeliveryRetail) as [string, ...string[]], {
//         error: "Выберите тип поставки",
//       })
//       .optional()
//       .nullable(),
//     contact: z.string(),
//     phone: z.string().optional(),
//     email: z.email("Некорректный email").or(z.literal("")).optional(),

//     amountCP: z.string().optional(),
//     delta: z.string().optional(),

//     dealStatus: z.enum(Object.values(StatusRetail) as [string, ...string[]], {
//       error: "Выберите статус проекта",
//     }),
//     comments: z.string(),
//     lastDateConnection: z.preprocess((val) => {
//       if (val instanceof Date) return val.toISOString();
//       if (!val) return "";
//       return val;
//     }, z.string()),
//     commentsLastConnection: z.string(),
//     plannedDateConnection: z.preprocess((val) => {
//       if (val instanceof Date) return val.toISOString();
//       if (!val) return "";
//       return val;
//     }, z.string()),
//     orderId: z.string().nullable().optional(),
//     resource: z.string().optional(),
//     contacts: z.array(SingleContactFormSchema),
//     managersIds: z.array(
//       z.object({
//         userId: z.string(),
//       }),
//     ),
//   })
//   .check((ctx) => {
//     const data = ctx.value;

//     if (
//       data.dealStatus !== StatusProject.REJECT &&
//       !data.plannedDateConnection?.trim()
//     ) {
//       ctx.issues.push({
//         code: "custom",
//         message: "Укажите планируемую дату подключения",
//         path: ["plannedDateConnection"],
//         input: data.plannedDateConnection,
//       });
//     }

//     const hasPhone = !!data.phone?.trim();
//     const hasEmail = !!data.email?.trim();

//     if (!hasPhone && !hasEmail) {
//       ctx.issues.push({
//         code: "custom",
//         message: "Укажите телефон или email",
//         path: ["phone"],
//         input: data.phone,
//       });

//       ctx.issues.push({
//         code: "custom",
//         message: "Укажите телефон или email",
//         path: ["email"],
//         input: data.email,
//       });
//     }
//   });

export const RetailFormSchema = z
  .object({
    id: z.string().optional(),
    // Всегда обязательное поле
    dateRequest: z.preprocess(
      (val) => {
        if (val instanceof Date) return val.toISOString()
        if (!val) return ""
        return val
      },
      z.string().min(1, "Укажите дату запроса"),
    ),

    // Все остальные поля делаем .optional() или либеральными,
    // чтобы они не блокировали REQUEST
    nameDeal: z.string().optional(),
    nameObject: z.string().optional(),
    inn: z.preprocess(
      (val) => (val === "" ? null : val),
      z
        .string()
        .regex(/^\d{10,12}$/, "ИНН должен содержать только цифры")
        .refine((val) => !val || val.length === 10 || val.length === 12, {
          message: "ИНН должен содержать 10 или 12 цифр",
        })
        .nullable()
        .optional(),
    ),

    // Используем preprocess, чтобы пустая строка "" не вызывала ошибку Enum
    direction: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(Object.values(DirectionRetail).filter(Boolean) as [string, ...string[]]).optional(),
    ),

    deliveryType: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .enum(Object.values(DeliveryRetail).filter(Boolean) as [string, ...string[]])
        .optional()
        .nullable(),
    ),

    contact: z.string().optional(),
    phone: z.string().optional(),
    email: z.email("Некорректный email").or(z.literal("")).optional(),

    amountCP: z.string().optional(),
    delta: z.string().optional(),

    // Статус обязателен, чтобы понимать, какую логику применять
    dealStatus: z.enum(Object.values(StatusRetail) as [string, ...string[]], {
      message: "Выберите статус сделки",
    }),

    comments: z.string().optional(),

    lastDateConnection: z.preprocess((val) => {
      if (val instanceof Date) return val.toISOString()
      if (!val) return ""
      return val
    }, z.string().optional()),

    commentsLastConnection: z.string().optional(),

    plannedDateConnection: z.preprocess((val) => {
      if (val instanceof Date) return val.toISOString()
      if (!val) return ""
      return val
    }, z.string().optional()),

    orderId: z.string().nullable().optional(),
    resource: z.string().optional(),

    contacts: z.array(SingleContactFormSchema).optional().default([]),

    managersIds: z
      .array(
        z.object({
          userId: z.string(),
        }),
      )
      .optional()
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.dealStatus === "REQUEST") {
      return
    }

    // 1. Проверка обязательных полей для всех статусов, КРОМЕ REQUEST
    const requiredFields: { key: keyof typeof data; label: string }[] = [
      { key: "nameDeal", label: "Введите название сделки" },
      { key: "nameObject", label: "Введите название объекта" },
      { key: "direction", label: "Выберите направление" },
      { key: "contact", label: "Укажите контактное лицо" },
      { key: "commentsLastConnection", label: "Введите комментарий" },
      { key: "deliveryType", label: "Выберите тип доставки" },
      { key: "contacts", label: "Добавьте хотя бы одного контакта" },
    ]

    requiredFields.forEach(({ key, label }) => {
      const value = data[key]
      if (!value || (typeof value === "string" && !value.trim())) {
        ctx.addIssue({
          code: "custom",
          message: label,
          path: [key],
          input: value,
        })
      }
    })

    if (data.dealStatus !== StatusProject.REJECT) {
      if (!data.plannedDateConnection?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Укажите планируемую дату подключения",
          path: ["plannedDateConnection"],
          input: data.plannedDateConnection,
        })
      }

      if (!data.resource?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Укажите ресурс",
          path: ["resource"],
          input: data.resource,
        })
      }
    }

    const hasPhone = !!data.phone?.trim()
    const hasEmail = !!data.email?.trim()

    if (!hasPhone && !hasEmail) {
      const msg = "Укажите телефон или email"
      ctx.addIssue({
        code: "custom",
        message: msg,
        path: ["phone"],
      })
      ctx.addIssue({
        code: "custom",
        message: msg,
        path: ["email"],
      })
    }
  })

export type ProjectSchema = z.infer<typeof ProjectFormSchema>
export type RetailSchema = z.infer<typeof RetailFormSchema>
