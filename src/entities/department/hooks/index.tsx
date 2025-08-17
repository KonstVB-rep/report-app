import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { checkTokens } from "@/shared/lib/helpers/checkTokens";

import { getDepartmentsWithUsers } from "../api";

export const useGetDepartmentsWithUsers = () => {
  const { authUser, isAuth } = useStoreUser();

  return useQuery({
    queryKey: ["depsWithUsers"],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        const [tokenCheckResult, tasks] = await Promise.all([
          checkTokens(),
          getDepartmentsWithUsers(),
        ]);
        // Если проверка токенов прошла успешно, возвращаем задачи
        if (tokenCheckResult) {
          return tasks;
        } else {
          throw new Error("Сессия недействительна");
        }
      } catch (error) {
        console.error("Ошибка useGetDepartmentsWithUsers:", error);

        // Обработка сетевых ошибок
        if (error instanceof Error && error.message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные");
          return null;
        }

        // Обработка Prisma ошибок
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          TOAST.ERROR(`Prisma ошибка: ${error.code}`);
        } else if (error instanceof Prisma.PrismaClientValidationError) {
          TOAST.ERROR("Ошибка валидации данных");
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
          TOAST.ERROR("Ошибка подключения к базе");
        }
        // Остальные ошибки
        else if (error instanceof Error) {
          TOAST.ERROR(error.message);
        } else {
          TOAST.ERROR("Неизвестная ошибка");
        }

        return null;
      }
    },
    enabled: isAuth,
  });
};
