"use server";

import { z } from "zod";

export interface ChatFormData {
  userId: string; // ID пользователя в вашей системе
  botName: string;
  chatId: string; // ID чата в Telegram
  telegramUserInfoId: string; // ID информации о Telegram пользователе
  chatName?: string;
}
export interface ActionResponseChat {
  success: boolean;
  message: string;
  errors?: {
    errors: string[];
    properties?: {
      [K in keyof ChatFormData]?: {
        errors: string[];
      };
    };
  };
  inputs?: {
    [K in keyof ChatFormData]?: string;
  };
}

const createChatFormSchema = z.object({
  userId: z
    .string()
    .min(1, { message: "ID пользователя не может быть пустым" }),
  botName: z.string().min(1, { message: "Имя бота не может быть пустым" }),
  chatId: z.string().min(1, { message: "ID чата не может быть пустым" }),
  telegramUserInfoId: z
    .string()
    .min(1, { message: "ID информации о пользователе не может быть пустым" }),
  chatName: z
    .string()
    .max(100, { message: "Имя чата не должно быть длиннее 100 символов" })
    .optional(),
});

export async function saveChat(
  prevState: ActionResponseChat | null,
  formData: FormData
): Promise<ActionResponseChat> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const rawData: ChatFormData = {
      userId: formData.get("userId") as string,
      botName: formData.get("botName") as string,
      chatId: formData.get("chatId") as string,
      telegramUserInfoId: formData.get("telegramUserInfoId") as string,
      chatName: formData.get("chatName")
        ? (formData.get("chatName") as string)
        : undefined,
    };

    const { data, success, error } = createChatFormSchema.safeParse(rawData);

    if (!success) {
      return {
        success: false,
        message: "Пожалуйста, исправьте ошибки в форме",
        errors: z.treeifyError(error),
        inputs: rawData,
      };
    }

    // await createUserTelegramChat(
    //   data.userId,
    //   data.botName,
    //   data.chatId,
    //   String(data.telegramUserInfoId),
    //   data.chatName || "noname"
    // );

    console.log(data, "data");

    return {
      success: true,
      message: "Бот сохранен",
    };
  } catch (error) {
    console.log("Произошла ошибка при сохранении бота", error);
    return {
      success: false,
      message: "Произошла ошибка при сохранении бота",
    };
  }
}
