import { z } from "zod";

import { LABEL_TASK_PRIORITY, LABEL_TASK_STATUS } from "../types";

export const TaskFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  taskStatus: z.enum(
    Object.values(LABEL_TASK_STATUS).filter(Boolean) as [string, ...string[]],
    {
      message: "Выберите статус",
    }
  ),
  taskPriority: z.enum(
    Object.values(LABEL_TASK_PRIORITY).filter(Boolean) as [string, ...string[]],
    {
      message: "Выберите приоритет",
    }
  ),
  executor: z.string(),
  dueDate: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val || ""),
    z.string()
  ),
  startDate: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val || ""),
    z.string()
  ),
});


export type TaskSchema = z.infer<typeof TaskFormSchema>;