"use client";

import { logout } from "@/feature/auth/logout";
import axiosInstance from "@/shared/api/axiosInstance";

import { AuthError } from "./customErrors";

export interface TokenCheckResponse {
  isValid: boolean;
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
      await logout();
      throw new AuthError("Сессия недействительна");
    }

    return true;
  } catch (error) {
    console.error("Ошибка проверки токенов:", error);
    throw error;
  }
};
