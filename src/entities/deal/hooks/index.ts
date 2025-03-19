import { getQueryClient } from "@/app/provider/query-provider";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDeal, getAllProjectsByDepartment, getAllRetailsByDepartment, getProjectById, getProjectsUser, getRetailById, getRetailsUser } from "../api";
import { TOAST } from "@/entities/user/ui/Toast";
import { Dispatch, SetStateAction } from "react";
import { ProjectResponse, RetailResponse } from "../types";
import { DealType } from "@prisma/client";

export const useDelDeal = (closeModalFn: Dispatch<SetStateAction<null>>, type: string) => {
  const queryClient = getQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: async (nealId: string) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return await deleteDeal(nealId, authUser.id, type);
    },
    onSuccess: () => {
      closeModalFn(null);
      console.log(`${type}s`, authUser?.id);
      TOAST.SUCCESS("Сделка успешно удалена");
      queryClient.invalidateQueries({
        queryKey: [`${type.toLowerCase()}s`, authUser?.id],
        exact: true,
      });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};


export const useGetProjectById = (id: string) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  // Пробуем достать проект из кэша
  const cachedProjects = queryClient.getQueryData<ProjectResponse[]>([
    "project",
    authUser?.id,
  ]);
  const cachedProject = cachedProjects?.find((p) => p.id === id);

  return useQuery<ProjectResponse | undefined, Error>({
    queryKey: ["project", [id]], // Ключ для кэширования
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        const project = await getProjectById(id, authUser.id);

        // Преобразуем null в undefined
        return project ?? undefined; // Если проект null, возвращаем undefined
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !cachedProject, // Делаем запрос ТОЛЬКО если в кэше нет данных
    initialData: cachedProject, // Если проект есть в кэше, используем его
  });
};


export const useGetRetailById = (id: string) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  // Пробуем достать проект из кэша
  const cachedProjects = queryClient.getQueryData<RetailResponse[]>([
    "retail",
    authUser?.id,
  ]);
  const cachedProject = cachedProjects?.find((p) => p.id === id);

  return useQuery<RetailResponse | undefined, Error>({
    queryKey: ["retail", id], // Ключ для кэширования
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        const project = await getRetailById(id, authUser.id);

        // Преобразуем null в undefined
        return project ?? undefined; // Если проект null, возвращаем undefined
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !cachedProject, // Делаем запрос ТОЛЬКО если в кэше нет данных
    initialData: cachedProject, // Если проект есть в кэше, используем его
  });
};


export const useGetDealById = <T extends ProjectResponse | RetailResponse>(
  id: string,
  type: DealType
) : { data: T | undefined } => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  // const typeFormatted = type.toLowerCase();

  const queryKey = [type.toLowerCase(), id];

  // Получаем кэшированные данные
  const cachedData = queryClient.getQueryData<Array<ProjectResponse | RetailResponse>>([
    type.toLowerCase(),
    authUser?.id,
  ]);
  const cachedEntity = cachedData?.find((p) => p.id === id) as T | undefined;

  // Функции для запроса данных
  const fetchFunctions = {
    [DealType.PROJECT]: getProjectById as (id: string, userId: string) => Promise<ProjectResponse>,
    [DealType.RETAIL]: getRetailById as (id: string, userId: string) => Promise<RetailResponse>,
  };

  const fetchFn = async (): Promise<T | undefined> => {
    if (!authUser?.id) {
      throw new Error("Пользователь не авторизован");
    }

    try {
      const entity = await fetchFunctions[type](id, authUser.id);
      return entity as T | undefined;
    } catch (error) {
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



export const useGetAllDealsByDepartmentByType = (userId: string, type: DealType) => {
  const { authUser } = useStoreUser();

  const queryKeys = {
    [type]: [`all-${type.toLocaleLowerCase()}s-department`, authUser?.departmentId],
  };

  const fetchFunctions = {
    [DealType.PROJECT]: getAllProjectsByDepartment as () => Promise<ProjectResponse[]>,
    [DealType.RETAIL]: getAllRetailsByDepartment as () => Promise<RetailResponse[]>,
  };

  return useQuery({
    queryKey: queryKeys[type],
    queryFn: async () => {
      try {
        return await fetchFunctions[type]();
      } catch (error) {
        console.log(error);
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId && !!authUser?.departmentId,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};


export const useGetRetailsUser = (userId: string) => {
  const { data, isError } = useQuery({
    queryKey: ["retails", userId],
    queryFn: async () => {
      try {
        return await getRetailsUser(userId as string);
      } catch (error) {
        if (!isError) TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  return { data };
};

export const useGetProjectsUser = (userId: string) => {
  const { data, isError } = useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      try {
        return await getProjectsUser(userId as string);
      } catch (error) {
        if (!isError) TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  return { data };
};

