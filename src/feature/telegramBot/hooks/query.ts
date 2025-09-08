import { useQuery } from "@tanstack/react-query";

import { getChatsByBotId } from "@/entities/tgBot/api";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/custom-components/ui/Toast";

export const useGetChatsByBotId = (botId: string | undefined) => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["chats", botId],
    queryFn: async () => {
      try {
        if (!authUser?.id) throw new Error("Пользователь не авторизован");
        if (!botId) {
          throw new Error("botId не найден");
        }
        return (await getChatsByBotId(botId)) || [];
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные");
        } else {
          TOAST.ERROR((error as Error).message);
        }
        throw error;
      }
    },
    enabled: !!authUser?.id && !!botId,
    retry: 0,
    initialData: [],
  });
};
