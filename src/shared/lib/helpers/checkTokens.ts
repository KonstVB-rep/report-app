import { logout } from "@/feature/auth/logout";
import axiosInstance from "@/shared/api/axiosInstance";
import { TOAST } from "@/shared/ui/Toast";

import { AuthError } from "./customErrors";

export interface TokenCheckResponse {
  isValid: boolean;
}

export const checkTokens = async (): Promise<void> => {
  try {
    const res = await axiosInstance.get<TokenCheckResponse>("/check-tokens", {
      withCredentials: true,
    });

    const { isValid } = res.data;

    if (!isValid) {
      TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
      logout();
      return;
    }
  } catch {
    throw new AuthError();
  }
};
