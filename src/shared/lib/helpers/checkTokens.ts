'use client'
import axiosInstance from "@/shared/api/axiosInstance";

import { AuthError } from "./customErrors";

export interface TokenCheckResponse {
  isValid: boolean;
  data: {
    userId: string;
    departmentId: number;
    exp: number;
  };
}

export const checkTokens = async (): Promise<boolean> => {
  try {
    const { data } = await axiosInstance.get<TokenCheckResponse>(
      "/check-tokens",
      {
        withCredentials: true,
      }
    );

    if (!data.isValid) {
      throw new AuthError("Сессия недействительна");
    }

    return true;
  } catch (error) {
    console.error("Ошибка проверки токенов:", error);
    throw error;
  }
};
