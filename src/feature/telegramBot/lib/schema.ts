import z from "zod"

export const createBotFormShema = z.object({
  botName: z
    .string()
    .min(3, "Имя должно быть не короче 3 символов")
    .max(50, "Имя должно быть не длиннее 50 символов"),
  token: z.string().min(10, "Токен должен быть не короче 10 символов"),
  description: z.string().min(5, "Описание должно быть не короче 5 символов"),
})

export const createChatFormSchema = z.object({
  userId: z.string().min(1, { message: "ID пользователя не может быть пустым" }),
  botName: z.string().min(1, { message: "Имя бота не может быть пустым" }),
  chatId: z.string().min(1, { message: "ID чата не может быть пустым" }),
  telegramUserInfoId: z
    .string()
    .min(1, { message: "ID информации о пользователе не может быть пустым" }),
  chatName: z.string().max(100, { message: "Имя чата не должно быть длиннее 100 символов" }),
  username: z
    .string()
    .min(3, { message: "Имя чата не может быть пустым" })
    .max(100, { message: "Имя чата не должно быть длиннее 100 символов" })
    .optional(),
  isActive: z.boolean().optional().default(true),
})

export const updateChatFormSchema = z.object({
  chatName: z.string().max(100, { message: "Имя чата не должно быть длиннее 100 символов" }),
  isActive: z.boolean().optional().default(true),
})
