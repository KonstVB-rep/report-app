import useStoreUser from "@/entities/user/store/useStoreUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllProjectsByDepartment,
  getAllRetailsByDepartment,
  getProjectById,
  getProjectsUser,
  getRetailById,
  getRetailsUser,
} from "../api";
import { TOAST } from "@/entities/user/ui/Toast";
import { ProjectResponse, RetailResponse } from "../types";
import { DealType } from "@prisma/client";
import {
  getAllProjectsByDepartmentQuery,
  getAllRetailsByDepartmentQuery,
} from "../api/queryFn";

export const useGetProjectById = (id: string, useCache: boolean = true) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const cachedDeals = queryClient.getQueryData<ProjectResponse[]>([
    "projects",
    authUser?.id,
  ]);
  const cachedDeal = cachedDeals?.find((p) => p.id === id);

  return useQuery<ProjectResponse | undefined, Error>({
    queryKey: ["project", id],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        const project = await getProjectById(id, authUser.id);

        return project ?? undefined;
      } catch (error) {
        console.log(error, "Ошибка useGetProjectById");
        TOAST.ERROR((error as Error).message);
      }
    },
    enabled: !useCache || !cachedDeal, // Запрос если нет в кэше ИЛИ useCache = false
    initialData: useCache ? cachedDeal : undefined, // Берем из кэша только если useCache = true
    staleTime: useCache ? 60 * 1000 : 0,
  });
};

export const useGetRetailById = (id: string, useCache: boolean = true) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const cachedDeals = queryClient.getQueryData<RetailResponse[]>([
    "retails",
    authUser?.id,
  ]);
  const cachedDeal = cachedDeals?.find((p) => p.id === id);

  return useQuery<RetailResponse | undefined, Error>({
    queryKey: ["retail", id],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        const project = await getRetailById(id, authUser.id);

        return project ?? undefined;
      } catch (error) {
        console.log(error, "Ошибка useGetRetailById");
        TOAST.ERROR((error as Error).message);
      }
    },
    enabled: !useCache || !cachedDeal, // Запрос если нет в кэше ИЛИ useCache = false
    initialData: useCache ? cachedDeal : undefined, // Берем из кэша только если useCache = true
    staleTime: useCache ? 60 * 1000 : 0,
  });
};

export const useGetDealById = <T extends ProjectResponse | RetailResponse>(
  id: string,
  type: DealType
) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const queryKey = [type.toLowerCase(), id];

  const cachedData = queryClient.getQueryData<
    Array<ProjectResponse | RetailResponse>
  >([`${type.toLowerCase()}s`, authUser?.id]);
  const cachedEntity = cachedData?.find((p) => p.id === id) as T | undefined;

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
      const entity = await fetchFunctions[type](id, authUser.id);
      return entity as T | undefined;
    } catch (error) {
      console.log(error, "Ошибка useGetDealById");
      TOAST.ERROR((error as Error).message);
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
      }
    },
    enabled: !!userId,
  });

  return { data,isError, ...restData };
};
