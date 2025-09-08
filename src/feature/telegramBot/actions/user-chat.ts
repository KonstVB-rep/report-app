"use server";

import { UserTelegramChat } from "@prisma/client";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import {
  createUserTelegramChat,
  updateUserTelegramChat,
} from "@/entities/tgBot/api";
import { ChatFormData } from "@/entities/tgBot/types";
import { ActionResponse } from "@/shared/types";

import { createChatFormSchema, updateChatFormSchema } from "../lib/schema";

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
        : undefined,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      isActive: formData.get("isActive") === "true",
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
      {
        tgUserId: data.telegramUserInfoId,
        tgUserName: data.username,
        firstName: rawData.firstName,
        lastName: rawData.lastName,
        isBot: false,
      },
      data.chatName,
      data.isActive
    );

    revalidatePath("/adminboard/bots");
    return {
      ...savedResult,
      result: data,
    };
  } catch (error) {
    console.log("Произошла ошибка при сохранении чата", error);
    return {
      success: false,
      message: "Произошла ошибка при сохранении чата",
    };
  }
}
type UpdateChatInput = Pick<UserTelegramChat, "chatName" | "isActive">;
export const updateChat = async (formData: FormData) => {
  try {
    const rawData: UpdateChatInput = {
      chatName: formData.get("chatName") as string,
      isActive: formData.get("isActive") === "true",
    };

    const { data, success, error } = updateChatFormSchema.safeParse(rawData);

    if (!success) {
      return {
        success: false,
        message: "Пожалуйста, исправьте ошибки в форме",
        errors: z.treeifyError(error),
        inputs: rawData,
      };
    }

    return await updateUserTelegramChat({
      ...data,
      chatId: formData.get("chatId") as string,
      botId: formData.get("botId") as string,
    });
  } catch (error) {
    console.log("Произошла ошибка при сохранении чата", error);
    return {
      success: false,
      message: "Произошла ошибка при сохранении чата",
    };
  }
};
