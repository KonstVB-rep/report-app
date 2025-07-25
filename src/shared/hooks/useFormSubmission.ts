import { useQueryClient } from "@tanstack/react-query";

import { useRef } from "react";

import useStoreUser from "@/entities/user/store/useStoreUser";

// Кастомный хук для инициализации необходимых состояний
export const useFormSubmission = () => {
  const queryClient = useQueryClient(); // Инициализация queryClient
  const { authUser } = useStoreUser(); // Получение информации о пользователе
  const isSubmittingRef = useRef(false); // Состояние для блокировки отправки формы

  return { queryClient, authUser, isSubmittingRef };
};
