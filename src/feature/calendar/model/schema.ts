import { z } from "zod";

// const normalizeTime = (time: string) => {
//   // Если время не в формате HH:mm, пытаемся нормализовать
//   if (!/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(time)) {
//     const date = new Date(time);
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     return `${hours}:${minutes}`;
//   }
//   return time;
// };

export const EventCalendarFormSchema = z
  .object({
    eventTitle: z.string({
      message: "Введите наименование события",
    }),

    allDay: z.boolean().optional(),
    startDateEvent: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date()
    ),

    endDateEvent: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date()
    ),

    startTimeEvent: z.preprocess((val) => {
      return (val as string).slice(0,5);
    }, z
      .string()
      .regex(
        /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/,
        "Некорректный формат времени"
      )),

    endTimeEvent: z.preprocess((val) => {
      return (val as string).slice(0,5);
    }, z
      .string()
      .regex(
        /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/,
        "Некорректный формат времени"
      )),
  })
  .refine(
    (data) => {
      if (data.allDay) return true;
      const now = new Date();
      const startDate = new Date(data.startDateEvent);
      const endDate = new Date(data.endDateEvent);

      const [startH, startM] = data.startTimeEvent.split(":");
      const [endH, endM] = data.endTimeEvent.split(":");

      startDate.setHours(parseInt(startH, 10), parseInt(startM, 10));
      endDate.setHours(parseInt(endH, 10), parseInt(endM, 10));

      return startDate <= endDate && startDate >= now && endDate > now;
    },
    {
      message:
        "Проверьте корректность дат и времени — начало должно быть раньше конца и не в прошлом",
      path: ["dateError"],
    }
  );

export type EventCalendarSchema = z.infer<typeof EventCalendarFormSchema>;
