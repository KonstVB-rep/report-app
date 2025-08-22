'use server'

import { createTelegramBot } from '@/feature/createTelegramChatBot/api';
import { z } from 'zod'

export interface BotFormData {
    botName: string;
    token: string;
}
export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    errors: string[];
    properties?: {
      [K in keyof BotFormData]?: {
        errors: string[];
      };
    };
  };
  inputs?: {
    [K in keyof BotFormData]?: string;
  };
}


const createBotFormShema = z.object({
  botName: z
    .string()
    .min(3, "Имя должно быть не короче 3 символов")
    .max(50, "Имя должно быть не длиннее 50 символов"),
  token: z.string().min(10, "Токен должен быть не короче 10 символов"),
});


export async function saveBot(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {

  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    const rawData: BotFormData = {
      botName: formData.get('botName') as string,
      token: formData.get('token') as string,
    }

    const {data, success, error } = createBotFormShema.safeParse(rawData)

    if (!success) {
      return {
        success: false,
        message: 'Пожалуйста, исправьте ошибки в форме',
        errors: z.treeifyError(error),
        inputs: rawData
      }
    }

    await createTelegramBot(data.botName, data.token)

    return {
      success: true,
      message: 'Бот сохранен',
    }
  } catch (error) {
    console.log('Произошла ошибка при сохранении бота', error)
    return {
      success: false,
      message: 'Произошла ошибка при сохранении бота',
    }
  }
}

