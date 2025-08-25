"use server";

import { User } from "@/entities/user/types";
import prisma from "@/prisma/prisma-client";

import { requireAuth } from "./requireAuth ";

export const handleAuthorization = async (): Promise<{
  user: User;
  userId: string;
}> => {
  const userId = await requireAuth();

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("Пользователь не найден");
  }

  return { user, userId };
};