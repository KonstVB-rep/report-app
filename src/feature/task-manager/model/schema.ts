// import { z } from "zod";

// import { TaskPriority, TaskStatus } from "@prisma/client";

// export const TaskFormSchema = z.object({
//   title: z.string(),
//   description: z.string(),
//   taskStatus: z.enum(
//     Object.values(TaskStatus) as [string, ...string[]],
//     {
//       message: "Выберите статус",
//     }
//   ),
//   taskPriority: z.enum(
//     Object.values(TaskPriority) as [string, ...string[]],
//     {
//       message: "Выберите приоритет",
//     }
//   ),
//   executorId: z.string(),
//    startDate: z.preprocess(
//     (val) => (val instanceof Date ? val.toISOString() : val || ""),
//     z.string()
//   ),
//   startTime: z.string(),
//   dueDate: z.preprocess(
//     (val) => (val instanceof Date ? val.toISOString() : val || ""),
//     z.string()
//   ),
//   endTime: z.string()
// }).superRefine(({ dueDate, startTime, startDate }, ctx) => {
//     // superRefine позволяет проверять поля вместе
//     if (!dueDate || !startTime) return;
//     console.log(dueDate < startDate, dueDate, startDate)
//     if(dueDate < startDate){
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Дата и время не могут быть в прошлом",
//         path: ["dueDate"]
//       });
//     }

//     // const now = new Date();
//     // const selectedDate = new Date(dueDate);
//     // selectedDate.setHours(...startTime.split(":").map(Number), 0, 0);

//     // if (selectedDate < now) {
//     //   ctx.addIssue({
//     //     code: z.ZodIssueCode.custom,
//     //     message: "Дата и время не могут быть в прошлом",
//     //     path: ["dueDate"]
//     //   });
//     // }
//   });


// export type TaskSchema = z.infer<typeof TaskFormSchema>;

import { z } from "zod";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { isBefore, isEqual, startOfToday, parseISO, format } from "date-fns";

// 👇 Простой хелпер для сравнения времени
const isTimeBefore = (timeA: string, timeB: string) => {
  return timeA < timeB;
};

export const TaskFormSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    taskStatus: z.enum(Object.values(TaskStatus) as [string, ...string[]]),
    taskPriority: z.enum(Object.values(TaskPriority) as [string, ...string[]]),
    executorId: z.string(),

    dueDate: z.preprocess(
      (val) => (typeof val === "string" ? parseISO(val) : val),
      z.date()
    ),
    startDate: z.preprocess(
      (val) => (typeof val === "string" ? parseISO(val) : val),
      z.date()
    ),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    const today = startOfToday();
    const nowTime = format(now, "HH:mm");

    // ❌ Нельзя выбрать прошлые даты
    if (isBefore(data.startDate, today)) {
      ctx.addIssue({
        path: ["startDate"],
        code: "custom",
        message: "Дата начала не может быть в прошлом",
      });
    }

    if (isBefore(data.dueDate, today)) {
      ctx.addIssue({
        path: ["dueDate"],
        code: "custom",
        message: "Дата окончания не может быть в прошлом",
      });
    }

    // ❌ dueDate < startDate
    if (isBefore(data.dueDate, data.startDate)) {
      ctx.addIssue({
        path: ["dueDate"],
        code: "custom",
        message: "Дата окончания не может быть раньше даты начала",
      });
    }

    // ❌ если дата одинаковая — startTime < endTime
    if (isEqual(data.startDate, data.dueDate)) {
      if (!isTimeBefore(data.startTime, data.endTime)) {
        ctx.addIssue({
          path: ["startTime"],
          code: "custom",
          message: "Время начала должно быть раньше времени окончания",
        });
      }
    }

    // ❌ если дата = сегодня — время не должно быть в прошлом
    const todayStr = format(today, "yyyy-MM-dd");

    if (format(data.startDate, "yyyy-MM-dd") === todayStr) {
      if (isTimeBefore(data.startTime, nowTime)) {
        ctx.addIssue({
          path: ["startTime"],
          code: "custom",
          message: "Время начала не может быть в прошлом",
        });
      }
    }

    if (format(data.dueDate, "yyyy-MM-dd") === todayStr) {
      if (isTimeBefore(data.endTime, nowTime)) {
        ctx.addIssue({
          path: ["endTime"],
          code: "custom",
          message: "Время окончания не может быть в прошлом",
        });
      }
    }
  });

  export type TaskSchema = z.infer<typeof TaskFormSchema>