
import prisma from "@/prisma/db/prisma-client";
import type { User } from "@prisma/client";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};