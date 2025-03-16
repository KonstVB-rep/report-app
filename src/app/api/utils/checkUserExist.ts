import prisma from "@/prisma/prisma-client";

export const checkUserExist = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return {
      error: true,
      message: "Пользователь не найден",
      data: null,
    };
  }
  return user; // Если пользователь найден, возвращаем null
};
