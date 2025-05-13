import { useQuery } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import { getEventsCalendarUser, getEventsCalendarUserToday } from "../api";

export const useGetEventsCalendarUser = () => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["eventsCalendar", authUser?.id],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getEventsCalendarUser();
      } catch (error) {
        console.log(error, "Ошибка useGetAllRetails");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    retry: !!authUser?.id,
  });
};


export const useGetEventsCalendarUserToday = () => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["eventsCalendarToday", authUser?.id],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getEventsCalendarUserToday();
      } catch (error) {
        console.log(error, "Ошибка useGetAllRetails");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    retry: !!authUser?.id,
  });
};
