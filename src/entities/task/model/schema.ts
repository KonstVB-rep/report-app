import { TaskPriority, TaskStatus } from "@prisma/client";

import { format, isBefore, isEqual, parseISO, startOfToday } from "date-fns";
import { z } from "zod";

const isTimeBefore = (timeA: string, timeB: string) => {
  return timeA < timeB;
};

const checkCtx = (
  ctx: z.core.ParsePayload<{
    title: string;
    description: string;
    taskStatus: string;
    taskPriority: string;
    executorId: string;
    dueDate: Date;
    startDate: Date;
    startTime: string;
    endTime: string;
  }>
) => {
  const data = ctx.value;
  const now = new Date();
  const today = startOfToday();
  const nowTime = format(now, "HH:mm");

  // ❌ Нельзя выбрать прошлые даты
  if (isBefore(data.startDate, today)) {
    ctx.issues.push({
      code: "custom",
      message: "Дата начала не может быть в прошлом",
      path: ["startDate"],
      input: data.startDate,
    });
  }

  if (isBefore(data.dueDate, today)) {
    ctx.issues.push({
      code: "custom",
      message: "Дата окончания не может быть в прошлом",
      path: ["dueDate"],
      input: data.dueDate,
    });
  }

  // ❌ dueDate < startDate
  if (isBefore(data.dueDate, data.startDate)) {
    ctx.issues.push({
      code: "custom",
      message: "Дата окончания не может быть раньше даты начала",
      path: ["dueDate"],
      input: data.dueDate,
    });
  }

  // ❌ если дата одинаковая — startTime < endTime
  if (isEqual(data.startDate, data.dueDate)) {
    if (!isTimeBefore(data.startTime, data.endTime)) {
      ctx.issues.push({
        code: "custom",
        message: "Время начала должно быть раньше времени окончания",
        path: ["startTime"],
        input: data.startTime,
      });
    }
  }

  // ❌ если дата = сегодня — время не должно быть в прошлом
  const todayStr = format(today, "yyyy-MM-dd");

  if (format(data.startDate, "yyyy-MM-dd") === todayStr) {
    if (isTimeBefore(data.startTime, nowTime)) {
      ctx.issues.push({
        code: "custom",
        message: "Время начала не может быть в прошлом",
        path: ["startTime"],
        input: data.startTime,
      });
    }
  }

  if (format(data.dueDate, "yyyy-MM-dd") === todayStr) {
    if (isTimeBefore(data.endTime, nowTime)) {
      ctx.issues.push({
        code: "custom",
        message: "Время окончания не может быть в прошлом",
        path: ["endTime"],
        input: data.endTime,
      });
    }
  }
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
  .check(checkCtx);

export const TaskFormSchemaUpdate = z
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
  .check(checkCtx);

export type TaskSchemaUpdate = z.infer<typeof TaskFormSchemaUpdate>;

export type TaskSchema = z.infer<typeof TaskFormSchema>;
