"use server";

import { User } from "@/entities/user/types";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";

import { requireAuth } from "./requireAuth ";

export const handleAuthorization = async (): Promise<{
  user: User | null;
  userId: string;
}> => {
  const userId = await requireAuth();

  // const isValisTokens = await checkTokens();

  if (!userId) {
    return handleError("Ошибка авторизации");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return handleError("Пользователь не найден");
  }

  const res = { user, userId };

  return res;
};
