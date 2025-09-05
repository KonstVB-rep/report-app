"use server";

import axiosInstance from "@/shared/api/axiosInstance";

export const sendNotify = async (
  message: string,
  chatId: string,
  botName: string
) => {
  try {
    return await axiosInstance.post(
      `/telegram/send-message-bot`,
      {
        message,
        chatId,
        botName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Ошибка при отправке:", error);
  }
};
