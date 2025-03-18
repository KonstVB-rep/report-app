import { getQueryClient } from "@/app/provider/query-provider";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProject, getProjectById } from "../api";
import { TOAST } from "@/entities/user/ui/Toast";
import { Dispatch, SetStateAction } from "react";
import { ProjectResponse } from "../types";

export const useDelProject = (closeModalFn: Dispatch<SetStateAction<null>>, type: string) => {
  const queryClient = getQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: async (nealId: string) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return await deleteProject(nealId, authUser.id, type);
    },
    onSuccess: () => {
      closeModalFn(null);
      queryClient.invalidateQueries({
        queryKey: [type, authUser?.id],
        exact: true,
      });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};

export const useGetProjects = () => {};

export const useGetProjectById = (id: string, type: string) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  // Пробуем достать проект из кэша
  const cachedProjects = queryClient.getQueryData<ProjectResponse[]>([
    "projects",
    authUser?.id,
  ]);
  const cachedProject = cachedProjects?.find((p) => p.id === id && p.type === type);

  return useQuery<ProjectResponse | undefined, Error>({
    queryKey: ["project", [id, type]], // Ключ для кэширования
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
  const cachedProjects = queryClient.getQueryData<ProjectResponse[]>([
    "retail",
    authUser?.id,
  ]);
  const cachedProject = cachedProjects?.find((p) => p.id === id);

  return useQuery<ProjectResponse | undefined, Error>({
    queryKey: ["retail", id], // Ключ для кэширования
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


// export const useGetAllDealsByDepartmentByType = (userId: string, type: string) => {

// };
