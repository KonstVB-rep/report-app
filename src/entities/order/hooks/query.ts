import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllOrder, getOrderById } from "../api";
import { OrderResponse } from "../types";
// import { OrderResponse } from "../types";

export const useGetOrders = () => {
  const { authUser } = useStoreUser();

  return useQuery({
    queryKey: ["orders", authUser?.departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }

        return await getAllOrder(String(authUser?.departmentId));
      } catch (error) {
        console.log(error, "Ошибка useGetAllProjects");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!authUser?.departmentId,
    retry: 2,
  });
};


export const useGetOrderById = (orderId: string, useCache: boolean = true) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const cachedDeals = queryClient.getQueryData<
    OrderResponse[]
  >(["orders", authUser?.departmentId]);
  const cachedDeal = cachedDeals?.find((p) => p.id === orderId);

  return useQuery<OrderResponse | null, Error>({
    queryKey: ["order", authUser?.departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }

        const deal = await getOrderById(orderId);

        if (!deal) {
          return null;
        }

        return deal;
      } catch (error) {
        console.error(
          (error as Error).message,
          "❌ Ошибка в useGetProjectById"
        );
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !useCache || !cachedDeal, // Запрос если нет в кэше ИЛИ useCache = false
    placeholderData: useCache ? cachedDeal : undefined, // Берем из кэша только если useCache = true
    staleTime: useCache ? 60 * 1000 : 0,
  });
};