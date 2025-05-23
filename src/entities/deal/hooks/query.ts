import { DealType } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import {
  getAllProjectsByDepartment,
  getAllRetailsByDepartment,
  getDealsByDateRange,
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
  DateRange,
  ProjectResponse,
  ProjectResponseWithContactsAndFiles,
  RetailResponse,
  RetailResponseWithContactsAndFiles,
} from "../types";

export const useGetProjectById = (dealId: string, useCache: boolean = true) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const cachedDeals = queryClient.getQueryData<
    ProjectResponseWithContactsAndFiles[]
  >(["projects", authUser?.id]);
  const cachedDeal = cachedDeals?.find((p) => p.id === dealId);

  return useQuery<ProjectResponseWithContactsAndFiles | null, Error>({
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

export const useGetRetailById = (dealId: string, useCache: boolean = true) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const cachedDeals = queryClient.getQueryData<
    RetailResponseWithContactsAndFiles[]
  >(["retails", authUser?.id]);
  const cachedDeal = cachedDeals?.find((p) => p.id === dealId);

  return useQuery<RetailResponseWithContactsAndFiles | null, Error>({
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
        console.error(error, "❌ Ошибка в useGetRetailById");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !useCache || !cachedDeal,
    placeholderData: useCache ? cachedDeal : undefined,
    staleTime: useCache ? 60 * 1000 : 0,
  });
};

export const useGetDealById = <
  T extends
    | ProjectResponseWithContactsAndFiles
    | RetailResponseWithContactsAndFiles,
>(
  dealId: string,
  type: DealType
) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const queryKey = [type.toLowerCase(), dealId];

  const cachedData = queryClient.getQueryData<
    Array<
      ProjectResponseWithContactsAndFiles | RetailResponseWithContactsAndFiles
    >
  >([`${type.toLowerCase()}s`, authUser?.id]);
  const cachedEntity = cachedData?.find((p) => p.id === dealId) as
    | T
    | undefined;

  // Функции для запроса данных
  const fetchFunctions = {
    [DealType.PROJECT]: getProjectById as (
      id: string,
      userId: string
    ) => Promise<ProjectResponseWithContactsAndFiles>,
    [DealType.RETAIL]: getRetailById as (
      id: string,
      userId: string
    ) => Promise<RetailResponseWithContactsAndFiles>,
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

export const useGetAllProjects = (
  userId: string | null,
  departmentId?: string | undefined
) => {
  const { authUser } = useStoreUser();

  return useQuery({
    queryKey: ["all-projects", authUser?.departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getAllProjectsByDepartmentQuery(departmentId);
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

export const useGetAllRetails = (
  userId: string | null,
  departmentId?: string | undefined
) => {
  const { authUser } = useStoreUser();

  return useQuery({
    queryKey: ["all-retails", authUser?.departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getAllRetailsByDepartmentQuery(departmentId);
      } catch (error) {
        console.log(error, "Ошибка useGetAllRetails");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId && !!authUser?.departmentId,
    placeholderData: undefined,
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
    placeholderData: undefined,
  });
  return { data, isError, ...restData };
};

export const useGetProjectsUser = (userId: string | undefined) => {
  const { authUser } = useStoreUser();
  return useQuery({
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
};

export const useGetDealsByDateRange = (
  userId: string,
  range: DateRange,
  dealType: DealType,
  departmentId: string
) => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["dealsByRange", userId, range, dealType, departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }

        return await getDealsByDateRange(
          userId as string,
          range,
          dealType,
          departmentId
        );
      } catch (error) {
        console.log(error, "Ошибка useGetProjectsUser");
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
  });
};
