"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { ActionResponse } from "@/shared/types";
import { createUserTelegramChat } from "@/feature/telegramChatBot/api";

export interface ChatFormData {
  userId: string; // ID пользователя в вашей системе
  botName: string;
  chatId: string; // ID чата в Telegram
  telegramUserInfoId: string; // ID информации о Telegram пользователе
  chatName: string;
  username?: string;
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
    .max(100, { message: "Имя чата не должно быть длиннее 100 символов" }),
  username: z
    .string()
    .min(3, { message: "Имя чата не может быть пустым" })
    .max(100, { message: "Имя чата не должно быть длиннее 100 символов" })
    .optional(),
});

export async function saveChat(
  formData: FormData
): Promise<ActionResponse<ChatFormData>> {
  try {
    
    const rawData: ChatFormData = {
      userId: formData.get("userId") as string,
      botName: formData.get("botName") as string,
      chatId: formData.get("chatId") as string,
      telegramUserInfoId: formData.get("telegramUserInfoId") as string,
      chatName: formData.get("chatName") as string,
      username: formData.get("username")
        ? (formData.get("username") as string)
        : undefined
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
  
    const savedResult = await createUserTelegramChat(
      data.userId,
      data.botName,
      data.chatId,
      String(data.telegramUserInfoId),
      data.chatName || "",
      data.username || ""
    );

    revalidatePath(formData.get("pathname") as string);
    return {
      ...savedResult,
      result:data
    };
  } catch (error) {
    console.log("Произошла ошибка при сохранении чата", error);
    return {
      success: false,
      message: "Произошла ошибка при сохранении чата",
    };
  }
}
