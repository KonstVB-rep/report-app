"use server";

import { revalidatePath } from "next/cache";



import { ActionResponse } from "@/shared/types";
import { createTelegramBot, updateBotDb } from "@/entities/tgBot/api";
import { BotFormData } from "@/entities/tgBot/types";
import z from "zod";
import { createBotFormShema } from "../lib/schema";


export async function saveBot(
  prevState: ActionResponse<BotFormData> | null,
  formData: FormData
): Promise<ActionResponse<BotFormData>> {
  try {
    const rawData: BotFormData = {
      botName: formData.get("botName") as string,
      token: formData.get("token") as string,
      description: (formData.get("description") as string),
    };

    const { data, success, error } = createBotFormShema.safeParse(rawData);

    if (!success) {
      return {
        success: false,
        message: "Пожалуйста, исправьте ошибки в форме",
        errors: z.treeifyError(error),
        inputs: rawData,
      };
    }

    await createTelegramBot(data.botName, data.token, data.description || "");
    revalidatePath(formData.get("pathname") as string);

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


export async function updateBot(
  prevState: ActionResponse<BotFormData> | null,
  formData: FormData
): Promise<ActionResponse<BotFormData>> {
  try {
    const rawData: BotFormData = {
      botName: formData.get("botName") as string,
      token: formData.get("token") as string,
      description: (formData.get("description") as string),
    };

    const { data, success, error } = createBotFormShema.safeParse(rawData);

    if (!success) {
      return {
        success: false,
        message: "Пожалуйста, исправьте ошибки в форме",
        errors: z.treeifyError(error),
        inputs: rawData,
      };
    }

    await updateBotDb({botName:data.botName, token:data.token, description:data.description || ""});
    revalidatePath(formData.get("pathname") as string);

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
