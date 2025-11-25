import { z } from "zod"

export const EventCalendarFormSchema = z
  .object({
    eventTitle: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "Введите наименование события"
          : "Наименование должно быть строкой",
    }),

    allDay: z.boolean().default(false),

    startDateEvent: z.coerce.date({
      error: (issue) => ({
        message: issue.input === undefined ? "Укажите дату начала" : "Некорректный формат даты",
      }),
    }),

    endDateEvent: z.coerce.date({
      error: (issue) => ({
        message: issue.input === undefined ? "Укажите дату окончания" : "Некорректный формат даты",
      }),
    }),

    startTimeEvent: z
      .string()
      .transform((val) => val.slice(0, 5))
      .refine((val) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        error: "Некорректный формат времени (HH:MM)",
      }),

    endTimeEvent: z
      .string()
      .transform((val) => val.slice(0, 5))
      .refine((val) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        error: "Некорректный формат времени (HH:MM)",
      }),
  })
  .check((ctx) => {
    const { allDay, startDateEvent, endDateEvent, startTimeEvent, endTimeEvent } = ctx.value

    if (allDay) return

    const now = new Date()
    const startDate = new Date(startDateEvent)
    const endDate = new Date(endDateEvent)

    const [startH, startM] = startTimeEvent.split(":")
    const [endH, endM] = endTimeEvent.split(":")

    startDate.setHours(parseInt(startH, 10), parseInt(startM, 10))
    endDate.setHours(parseInt(endH, 10), parseInt(endM, 10))
    now.setSeconds(0, 0)

    // Проверка на то, что дата начала не позже даты окончания
    if (startDate > endDate) {
      ctx.issues.push({
        code: "custom",
        message: "Дата начала не может быть позже даты окончания",
        path: ["startDateEvent"],
        input: startDateEvent,
      })
    }

    // Проверка на то, что дата начала не в прошлом
    if (startDate < now) {
      ctx.issues.push({
        code: "custom",
        message: "Дата начала не может быть в прошлом",
        path: ["startDateEvent"],
        input: startDateEvent,
      })
    }

    // Проверка на то, что дата окончания должна быть в будущем
    if (endDate <= now) {
      ctx.issues.push({
        code: "custom",
        message: "Дата окончания должна быть в будущем",
        path: ["endDateEvent"],
        input: endDateEvent,
      })
    }

    // Если времени окончания меньше времени начала
    if (startDate >= endDate) {
      ctx.issues.push({
        code: "custom",
        message: "Время окончания события не должно быть меньше времени начала!",
        path: ["startDateEvent"],
        input: startDateEvent,
      })
    }
  })
export type EventCalendarSchema = z.infer<typeof EventCalendarFormSchema>
