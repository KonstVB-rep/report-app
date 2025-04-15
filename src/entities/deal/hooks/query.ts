import { DealType } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import {
  getAllProjectsByDepartment,
  getAllRetailsByDepartment,
  getProjectById,
  getProjectsUser,
  getRetailById,
  getRetailsUser,
} from "../api";
import {
  getAllProjectsByDepartmentQuery,
  getAllRetailsByDepartmentQuery,
} from "../api/queryFn";
import {
  ProjectResponse,
  ProjectResponseWithAdditionalContacts,
  RetailResponse,
  RetailResponseWithAdditionalContacts,
} from "../types";

export const useGetProjectById = (dealId: string, useCache: boolean = true) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const cachedDeals = queryClient.getQueryData<
    ProjectResponseWithAdditionalContacts[]
  >(["projects", authUser?.id]);
  const cachedDeal = cachedDeals?.find((p) => p.id === dealId);

  return useQuery<ProjectResponseWithAdditionalContacts | null, Error>({
    queryKey: ["project", dealId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }

        const deal = await getProjectById(dealId, authUser.id);

        if (!deal) {
          return null;
        }

        return deal;
      } catch (error) {
        console.error(error, "❌ Ошибка в useGetProjectById");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !useCache || !cachedDeal, // Запрос если нет в кэше ИЛИ useCache = false
    placeholderData: useCache ? cachedDeal : undefined, // Берем из кэша только если useCache = true
    staleTime: useCache ? 60 * 1000 : 0,
  });
};

export const useGetRetailById = (dealId: string, useCache: boolean = true) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const cachedDeals = queryClient.getQueryData<
    RetailResponseWithAdditionalContacts[]
  >(["retails", authUser?.id]);
  const cachedDeal = cachedDeals?.find((p) => p.id === dealId);

  return useQuery<RetailResponseWithAdditionalContacts | null, Error>({
    queryKey: ["retail", dealId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }

        const deal = await getRetailById(dealId, authUser.id);

        if (!deal) {
          return null;
        }

        return deal;
      } catch (error) {
        console.error(error, "❌ Ошибка в useGetProjectById");
        TOAST.ERROR((error as Error).message);
        throw error; // обязательно пробрасываем, иначе React Query думает, что всё ок
      }
    },
    enabled: !useCache || !cachedDeal, // Запрос если нет в кэше ИЛИ useCache = false
    placeholderData: useCache ? cachedDeal : undefined, // Берем из кэша только если useCache = true
    staleTime: useCache ? 60 * 1000 : 0,
  });
};

export const useGetDealById = <T extends ProjectResponse | RetailResponse>(
  dealId: string,
  type: DealType
) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const queryKey = [type.toLowerCase(), dealId];

  const cachedData = queryClient.getQueryData<
    Array<ProjectResponse | RetailResponse>
  >([`${type.toLowerCase()}s`, authUser?.id]);
  const cachedEntity = cachedData?.find((p) => p.id === dealId) as
    | T
    | undefined;

  // Функции для запроса данных
  const fetchFunctions = {
    [DealType.PROJECT]: getProjectById as (
      id: string,
      userId: string
    ) => Promise<ProjectResponse>,
    [DealType.RETAIL]: getRetailById as (
      id: string,
      userId: string
    ) => Promise<RetailResponse>,
  };

  const fetchFn = async (): Promise<T | undefined> => {
    try {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      const entity = await fetchFunctions[type](dealId, authUser.id);
      return entity as T | undefined;
    } catch (error) {
      console.log(error, "Ошибка useGetDealById");
      TOAST.ERROR((error as Error).message);
      throw error;
    }
  };

  return useQuery<T | undefined, Error>({
    queryKey,
    queryFn: fetchFn,
    enabled: !cachedEntity,
    initialData: cachedEntity,
  });
};

export const useGetAllDealsByDepartmentByType = (
  userId: string,
  type: DealType
) => {
  const { authUser } = useStoreUser();

  const queryKeys = {
    [type]: [
      `all-${type.toLocaleLowerCase()}s-department`,
      authUser?.departmentId,
    ],
  };

  const fetchFunctions = {
    [DealType.PROJECT]: getAllProjectsByDepartment as () => Promise<
      ProjectResponse[]
    >,
    [DealType.RETAIL]: getAllRetailsByDepartment as () => Promise<
      RetailResponse[]
    >,
  };

  return useQuery({
    queryKey: queryKeys[type],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await fetchFunctions[type]();
      } catch (error) {
        console.log(error, "Ошибка useGetAllDealsByDepartmentByType");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId && !!authUser?.departmentId,
    retry: 2,
  });
};

export const useGetAllProjects = (userId: string | null) => {
  const { authUser } = useStoreUser();

  return useQuery({
    queryKey: ["all-projects", authUser?.departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getAllProjectsByDepartmentQuery();
      } catch (error) {
        console.log(error, "Ошибка useGetAllProjects");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId && !!authUser?.departmentId,
    retry: 2,
  });
};

export const useGetAllRetails = (userId: string | null) => {
  const { authUser } = useStoreUser();

  return useQuery({
    queryKey: ["all-retails", authUser?.departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getAllRetailsByDepartmentQuery();
      } catch (error) {
        console.log(error, "Ошибка useGetAllRetails");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId && !!authUser?.departmentId,
    retry: 2,
  });
};

export const useGetRetailsUser = (userId: string | null) => {
  const { authUser } = useStoreUser();
  const { data, isError, ...restData } = useQuery({
    queryKey: ["retails", userId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getRetailsUser(userId as string);
      } catch (error) {
        console.log(error, "Ошибка useGetRetailsUser");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
  });
  return { data, isError, ...restData };
};

export const useGetProjectsUser = (userId: string | null) => {
  const { authUser } = useStoreUser();
  const { data, isError, ...restData } = useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getProjectsUser(userId as string);
      } catch (error) {
        console.log(error, "Ошибка useGetProjectsUser");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
  });

  return { data, isError, ...restData };
};
