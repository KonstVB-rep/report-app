"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { createTelegramBot } from "@/feature/telegramChatBot/api";
import { ActionResponse } from "@/shared/types";

export interface BotFormData {
  botName: string;
  token: string;
  description?: string;
}

const createBotFormShema = z.object({
  botName: z
    .string()
    .min(3, "Имя должно быть не короче 3 символов")
    .max(50, "Имя должно быть не длиннее 50 символов"),
  token: z.string().min(10, "Токен должен быть не короче 10 символов"),
  description: z.string().optional(),
});

export async function saveBot(
  prevState: ActionResponse<BotFormData> | null,
  formData: FormData
): Promise<ActionResponse<BotFormData>> {
  try {
    const rawData: BotFormData = {
      botName: formData.get("botName") as string,
      token: formData.get("token") as string,
      description: (formData.get("description") as string) || undefined,
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

    await createTelegramBot(data.botName, data.token);
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
