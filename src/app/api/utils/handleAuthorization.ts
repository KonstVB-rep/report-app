import { requireAuth } from "./requireAuth ";
import { handleError } from "@/shared/api/handleError";
import prisma from "@/prisma/prisma-client";
import { User } from "@/entities/user/types";

interface Response<T> {
  error: boolean;
  message: string | null;
  data: T | null;
}

export const handleAuthorizationAction = async (): Promise<
  Response<{ user: User; userId: string }>
> => {
  const userId = await requireAuth();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user)
    return { error: true, message: "Пользователь не найден", data: null };

  return { error: false, message: null, data: { user, userId } };
};

export const handleAuthorization = async (): Promise<{
  user: User | null;
  userId: string;
}> => {
  const userId = await requireAuth();

  if (!userId) {
    return handleError("Ошибка авторизации");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return handleError("Пользователь не найден");
  }

  return { user, userId };
};
