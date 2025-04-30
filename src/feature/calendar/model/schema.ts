import { z } from "zod";

export const EventCalendarFormSchema = z.object({
  eventTitle: z.string({
    message: "Введите наименование события",
  }),
  startDateEvent: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date()
  ),

  startTimeEvent: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/,
      "Некорректный формат времени"
    ),

  endDateEvent: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date()
  ),

  endTimeEvent: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/,
      "Некорректный формат времени"
    ),
}).refine((data) => {
  const now = new Date();
  const startDate = new Date(data.startDateEvent);
  const endDate = new Date(data.endDateEvent);

  const [startH, startM] = data.startTimeEvent.split(':')
  const [endH, endM] = data.endTimeEvent.split(':')
  
  startDate.setHours(parseInt(startH, 10), parseInt(startM, 10));
  endDate.setHours(parseInt(endH, 10), parseInt(endM, 10));

  return (startDate <= endDate &&
    startDate >= now &&
    endDate > now)
}, {
  message: "Проверьте корректность дат и времени — начало должно быть раньше конца и не в прошлом",
  path: ['dateError']
});


export type EventCalendarSchema = z.infer<typeof EventCalendarFormSchema>;
