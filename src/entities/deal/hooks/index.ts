import { getQueryClient } from "@/app/provider/query-provider";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, createRetail, deleteDeal, getAllProjectsByDepartment, getAllRetailsByDepartment, getProjectById, getProjectsUser, getRetailById, getRetailsUser, updateProject, updateRetail } from "../api";
import { TOAST } from "@/entities/user/ui/Toast";
import { Dispatch, SetStateAction } from "react";
import { ProjectResponse, RetailResponse } from "../types";
import { DealType, DeliveryProject, DeliveryRetail, DirectionProject, DirectionRetail, StatusProject, StatusRetail } from "@prisma/client";
import { ProjectSchema, RetailSchema } from "../model/schema";
import { UseFormReturn } from "react-hook-form";

export const useDelDeal = (closeModalFn: Dispatch<SetStateAction<void>>, type: string) => {
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
      closeModalFn();
      TOAST.SUCCESS("Сделка успешно удалена");
      queryClient.invalidateQueries({
        queryKey: [`${type.toLowerCase()}s`, authUser?.id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [`${type.toLowerCase()}`, authUser?.id],
        exact: true,
      });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};


export const useGetProjectById = (id: string,useCache: boolean = true) => {
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
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !useCache || !cachedDeal, // Запрос если нет в кэше ИЛИ useCache = false
    initialData: useCache ? cachedDeal : undefined, // Берем из кэша только если useCache = true
    staleTime: useCache ? 60 * 1000 : 0
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
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !useCache || !cachedDeal, // Запрос если нет в кэше ИЛИ useCache = false
    initialData: useCache ? cachedDeal : undefined, // Берем из кэша только если useCache = true
    staleTime: useCache ? 60 * 1000 : 0
  });
};


export const useGetDealById = <T extends ProjectResponse | RetailResponse>(
  id: string,
  type: DealType
) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  const queryKey = [type.toLowerCase(), id];

  const cachedData = queryClient.getQueryData<Array<ProjectResponse | RetailResponse>>([
    `${type.toLowerCase()}s`,
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
    retry: 2,
  });
};


export const useGetRetailsUser = (userId: string | null) => {

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
  });

  return { data };
};

export const useGetProjectsUser = (userId: string | null) => {
  const { data, isError, ...restData } = useQuery({
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
  });

  return { data, ...restData };
};


export const useMutationUpdateProject = (dealId: string, close: () => void) => {
    const queryClient = useQueryClient();
    const { authUser } = useStoreUser();


 return  useMutation({
    mutationFn: (data: ProjectSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return updateProject({
        ...data,
        id: dealId,
        email: data.email || "",
        phone: data.phone || "",
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType: data.deliveryType as DeliveryProject,
        dateRequest: new Date(),
        projectStatus: data.projectStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(data.amountCP.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        amountPurchase: data.amountPurchase
          ? parseFloat(data.amountPurchase.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        amountWork: data.amountWork
          ? parseFloat(data.amountWork.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
        delta: data.delta
          ? parseFloat(data.delta.replace(/\s/g, "").replace(",", ".")).toString()
          : "0",
      });
    },

    // Оптимистичное обновление UI перед запросом
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["projects", authUser?.id] });
      await queryClient.cancelQueries({ queryKey: ["project", dealId] });

      const previousDeals = queryClient.getQueryData<ProjectResponse[]>(["projects", authUser?.id]);
      
      const previousDeal = queryClient.getQueryData<ProjectResponse[]>(["project", dealId]);

      queryClient.setQueryData<ProjectResponse[]>(["projects", authUser?.id], (oldProjects) => {
        if (!oldProjects) return oldProjects;
        return oldProjects.map((p) => (p.id === dealId ? { 
          ...p, 
          ...newData,   
          direction: newData.direction as DirectionProject,
          projectStatus: newData.projectStatus as StatusProject,
          deliveryType: newData.deliveryType as DeliveryProject,
          plannedDateConnection: newData.plannedDateConnection
          ? new Date(newData.plannedDateConnection)
          : null,
         } : p));
      });

      queryClient.setQueryData<ProjectResponse>(["project", dealId], (oldProject) => {
        if (!oldProject) return oldProject;
        
        return {
          ...oldProject,
          ...newData,
          direction: newData.direction as DirectionProject,
          projectStatus: newData.projectStatus as StatusProject,
          deliveryType: newData.deliveryType as DeliveryProject,
          plannedDateConnection: newData.plannedDateConnection
          ? new Date(newData.plannedDateConnection)
          : null,
        };
      });

      return { previousDeals, previousDeal };
    },

    // 🔄 Откат данных в случае ошибки
    onError: (_error, _newData, context) => {
      if (context?.previousDeal) {
        queryClient.setQueryData(["project", dealId], context.previousDeal);
      }
      if (context?.previousDeals) {
        queryClient.setQueryData(["projects", authUser?.id], context.previousDeals);
      }
    },

    // ✅ Если успех — обновляем кэш без лишнего запроса
    onSuccess: (updatedDeal) => {

      close();

      queryClient.setQueryData(["projects", authUser?.id], (oldProjects: ProjectResponse[] | undefined) =>
        oldProjects ? oldProjects.map((p) => (p.id === dealId ? updatedDeal : p)) : oldProjects
      );

      queryClient.setQueryData(["project", dealId], updatedDeal);

      // 👇 Инвалидируем кэш, только если серверные данные могли измениться
      queryClient.invalidateQueries({ queryKey: ["projects", authUser?.id], exact: true });
      queryClient.invalidateQueries({ queryKey: ["project", dealId], exact: true });
    },
  });
};

export const useMutationUpdateRetail = (dealId: string, close: () => void) => {
    const queryClient = useQueryClient();
    const { authUser } = useStoreUser();
  
    return useMutation({
      mutationFn: (data: RetailSchema) => {
        if (!authUser?.id) {
          throw new Error("User ID is missing");
        }
  
        return updateRetail({
          id: dealId,
          ...data,
          email: data.email || "",
          phone: data.phone || "",
          additionalContact: data.additionalContact || "",
          userId: authUser.id,
          deliveryType: data.deliveryType as DeliveryRetail,
          dateRequest: new Date(),
          projectStatus: data.projectStatus as StatusRetail,
          plannedDateConnection: data.plannedDateConnection
            ? new Date(data.plannedDateConnection)
            : null,
          direction: data.direction as DirectionRetail,
          amountCP: data.amountCP
            ? parseFloat(
                data.amountCP.replace(/\s/g, "").replace(",", ".")
              ).toString()
            : "0",
          delta: data.delta
            ? parseFloat(
                data.delta.replace(/\s/g, "").replace(",", ".")
              ).toString()
            : "0",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["retails", authUser?.id] });
      await queryClient.cancelQueries({ queryKey: ["retail", dealId] });
  
        const previousDeals = queryClient.getQueryData<RetailResponse[]>(["retails", authUser?.id]);
        
        const previousDeal = queryClient.getQueryData<RetailResponse[]>(["retail", dealId]);
  
        queryClient.setQueryData<RetailResponse[]>(["retails", authUser?.id], (oldProjects) => {
          if (!oldProjects) return oldProjects;
          return oldProjects.map((p) => (p.id === dealId ? { 
            ...p, 
            ...newData,   
            direction: newData.direction as DirectionRetail,
            projectStatus: newData.projectStatus as StatusRetail,
            deliveryType: newData.deliveryType as DeliveryRetail,
            plannedDateConnection: newData.plannedDateConnection
            ? new Date(newData.plannedDateConnection)
            : null,
           } : p));
        });
  
        queryClient.setQueryData<RetailResponse>(["retail", dealId], (oldProject) => {
          if (!oldProject) return oldProject;
          
          return {
            ...oldProject,
            ...newData,
            direction: newData.direction as DirectionRetail,
            projectStatus: newData.projectStatus as StatusRetail,
            deliveryType: newData.deliveryType as DeliveryRetail,
            plannedDateConnection: newData.plannedDateConnection
            ? new Date(newData.plannedDateConnection)
            : null,
          };
        });
  
        return { previousDeals, previousDeal };
      },
      onError: (_error, _newData, context) => {
        if (context?.previousDeal) {
          queryClient.setQueryData(["retail", dealId], context.previousDeal);
        }
        if (context?.previousDeals) {
          queryClient.setQueryData(["retails", authUser?.id], context.previousDeals);
        }
      },
  
      // ✅ Если успех — обновляем кэш без лишнего запроса
      onSuccess: (updatedDeal) => {
        close();
  
        queryClient.setQueryData(["retails", authUser?.id], (oldProjects: RetailResponse[] | undefined) =>
          oldProjects ? oldProjects.map((p) => (p.id === dealId ? updatedDeal : p)) : oldProjects
        );
  
        queryClient.setQueryData(["retail", dealId], updatedDeal);
  
        // 👇 Если серверные данные могли измениться, сбрасываем кэш
        queryClient.invalidateQueries({ queryKey: ["retails", authUser?.id], exact: true });
        queryClient.invalidateQueries({ queryKey: ["retail", dealId], exact: true });
      },
    });
}


export const useCreateProject = (form:UseFormReturn<ProjectSchema>) => {
   const queryClient = useQueryClient();
  
    const { authUser } = useStoreUser();
  
    return useMutation({
      mutationFn: (data: ProjectSchema) => {
        if (!authUser?.id) {
          throw new Error("User ID is missing");
        }

        return createProject({
          ...data,
          email: data.email || "",
          phone: data.phone || "",
          additionalContact: data.additionalContact || "",
          userId: authUser.id,
          deliveryType:
            data.deliveryType === "" ? null : data.deliveryType as DeliveryProject,
          dateRequest: new Date(),
          projectStatus: data.projectStatus as StatusProject,
          plannedDateConnection: data.plannedDateConnection
            ? new Date(data.plannedDateConnection)
            : null,
          direction: data.direction as DirectionProject,
          amountCP: data.amountCP
            ? parseFloat(
                data.amountCP.replace(/\s/g, "").replace(",", ".")
              ).toString()
            : "0", // Преобразуем в строку
          amountPurchase: data.amountPurchase
            ? parseFloat(
                data.amountPurchase.replace(/\s/g, "").replace(",", ".")
              ).toString()
            : "0",
          amountWork: data.amountWork
            ? parseFloat(
                data.amountWork.replace(/\s/g, "").replace(",", ".")
              ).toString()
            : "0",
          delta: data.delta
            ? parseFloat(
                data.delta.replace(/\s/g, "").replace(",", ".")
              ).toString()
            : "0", // Преобразуем в строку
        });
      },
      
      onSuccess: (data) => {
        if (data) {
          // setOpen(false);
          form.reset();
  
          queryClient.invalidateQueries({
            queryKey: ["projects", authUser?.id],
            exact: true,
          });
        }
      },
    });
}


export const useCreateRetail = (form:UseFormReturn<RetailSchema>) => {
  const queryClient = useQueryClient();
  
  const { authUser } = useStoreUser();

  return  useMutation({
    mutationFn: (data: RetailSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return createRetail({
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType: data.deliveryType === "" ? null : data.deliveryType as DeliveryRetail,
        dateRequest: new Date(),
        projectStatus: data.projectStatus as StatusRetail,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionRetail,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
      });
    },
    onError: (error) => {
      // Обработка ошибок
      console.error("Ошибка при создании проекта:", error);
      TOAST.ERROR("Ошибка при создании проекта");
    },
    onSuccess: (data) => {
      if (data) {
        // setOpen(false);

        form.reset();

        queryClient.invalidateQueries({
          queryKey: ["retails", authUser?.id],
          exact: true,
        });
      }
    },
  });

}