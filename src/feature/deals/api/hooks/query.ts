import { DealType } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import {
  getAdditionalContacts,
  getAllDealsByDepartment,
  getDealsByDateRange,
  getProjectById,
  getProjectsUser,
  getRetailById,
  getRetailsUser,
} from "@/entities/deal/api"
import {
  getAllProjectsByDepartmentQuery,
  getAllRetailsByDepartmentQuery,
} from "@/entities/deal/api/queryFn"
import type {
  DateRange,
  DealsUnionType,
  ProjectResponseWithContactsAndFiles,
  RetailResponseWithContactsAndFiles,
  TableType,
} from "@/entities/deal/types"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"

export const useGetProjectById = (dealId: string, useCache: boolean = true) => {
  const { queryClient, authUser } = useFormSubmission()

  const cachedDeals = queryClient.getQueryData<ProjectResponseWithContactsAndFiles[]>([
    "projects",
    authUser?.id,
  ])
  const cachedDeal = cachedDeals?.find((p) => p.id === dealId)

  return useQuery<ProjectResponseWithContactsAndFiles | null, Error>({
    queryKey: ["project", dealId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован")
        }

        const deal = await getProjectById(dealId)

        if (!deal) {
          return null
        }

        return deal ?? {}
      } catch (error) {
        console.error((error as Error).message, "❌ Ошибка в useGetProjectById")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !useCache || !cachedDeal,
    placeholderData: useCache ? cachedDeal : undefined,
    staleTime: useCache ? 60 * 1000 : 0,
    retry: 2,
  })
}

export const useGetRetailById = (dealId: string, useCache: boolean = true) => {
  const { queryClient, authUser } = useFormSubmission()

  const cachedDeals = queryClient.getQueryData<RetailResponseWithContactsAndFiles[]>([
    "retails",
    authUser?.id,
  ])
  const cachedDeal = cachedDeals?.find((p) => p.id === dealId)

  return useQuery<RetailResponseWithContactsAndFiles | null, Error>({
    queryKey: ["retail", dealId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован")
        }

        const deal = await getRetailById(dealId)

        if (!deal) {
          return null
        }

        return deal ?? {}
      } catch (error) {
        console.error(error, "❌ Ошибка в useGetRetailById")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !useCache || !cachedDeal,
    placeholderData: useCache ? cachedDeal : undefined,
    staleTime: useCache ? 60 * 1000 : 0,
    retry: 2,
  })
}

export const useGetDealById = <
  T extends ProjectResponseWithContactsAndFiles | RetailResponseWithContactsAndFiles,
>(
  dealId: string,
  type: DealType,
) => {
  const { queryClient, authUser } = useFormSubmission()

  const queryKey = [type.toLowerCase(), dealId]

  const cachedData = queryClient.getQueryData<
    Array<ProjectResponseWithContactsAndFiles | RetailResponseWithContactsAndFiles>
  >([`${type.toLowerCase()}s`, authUser?.id])
  const cachedEntity = cachedData?.find((p) => p.id === dealId) as T | undefined

  const fetchFn = async (): Promise<T | undefined> => {
    try {
      if (type !== DealType.PROJECT && type !== DealType.RETAIL) {
        throw new Error(`Нет функции для типа сделки: ${type}`)
      }

      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован")
      }

      let entity: T | undefined

      if (type === DealType.PROJECT) {
        const project = await getProjectById(dealId)

        entity = project as T | undefined
      }

      if (type === DealType.RETAIL) {
        const retail = await getRetailById(dealId)
        entity = retail as T | undefined
      }

      return entity
    } catch (error) {
      console.log(error, "Ошибка useGetDealById")
      if ((error as Error).message === "Failed to fetch") {
        TOAST.ERROR("Не удалось получить данные")
      } else {
        TOAST.ERROR((error as Error).message)
      }
      throw error
    }
  }

  return useQuery<T | undefined, Error>({
    queryKey,
    queryFn: fetchFn,
    enabled: !cachedEntity,
    initialData: cachedEntity,
  })
}

export const useGetAllProjects = (userId: string | null, departmentId: number) => {
  // const { authUser } = useStoreUser()

  return useQuery({
    queryKey: ["all-projects", departmentId],
    queryFn: async () => {
      try {
        // if (!authUser?.id) {
        //   throw new Error("Пользователь не авторизован")
        // }

        return (await getAllProjectsByDepartmentQuery(departmentId)) ?? []
      } catch (error) {
        console.log(error, "Ошибка useGetAllProjects")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!userId && !!departmentId,
    retry: 2,
    staleTime: 1000 * 60,
    refetchInterval: 60 * 1000 * 5,
  })
}

export const useGetAllRetails = (userId: string | null, departmentId: number) => {
  // const { authUser } = useStoreUser()

  return useQuery({
    queryKey: ["all-retails", departmentId],
    queryFn: async () => {
      try {
        // if (!authUser?.id) {
        //   throw new Error("Пользователь не авторизован")
        // }

        return (await getAllRetailsByDepartmentQuery(departmentId)) ?? []
      } catch (error) {
        console.log(error, "Ошибка useGetAllRetails")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!userId && !!departmentId,
    placeholderData: undefined,
    staleTime: 1000 * 60,
    refetchInterval: 60 * 1000 * 5,
  })
}

export const useGetRetailsUser = (userId: string | undefined) => {
  // const { authUser } = useStoreUser()
  const { data, isError, ...restData } = useQuery({
    queryKey: ["retails", userId],
    queryFn: async () => {
      try {
        // if (!authUser?.id) {
        //   throw new Error("Пользователь не авторизован")
        // }

        return (await getRetailsUser(userId as string)) ?? []
      } catch (error) {
        console.log(error, "Ошибка useGetRetailsUser")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!userId,
    placeholderData: undefined,
    staleTime: 1000 * 60,
    refetchInterval: 60 * 1000 * 5,
  })
  return { data, isError, ...restData }
}

export const useGetProjectsUser = (userId: string | undefined) => {
  // const { authUser } = useStoreUser()
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      try {
        // if (!authUser?.id) {
        //   throw new Error("Пользователь не авторизован")
        // }

        return (await getProjectsUser(userId as string)) ?? []
      } catch (error) {
        console.log(error, "Ошибка useGetProjectsUser")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchInterval: 60 * 1000 * 5,
  })
}

export const useGetContractsUser = (userId: string | undefined) => {
  // const { authUser } = useStoreUser()
  return useQuery({
    queryKey: ["contracts", userId],
    queryFn: async () => {
      try {
        // if (!authUser?.id) {
        //   throw new Error("Пользователь не авторизован")
        // }

        return (await getProjectsUser(userId as string)) ?? []
      } catch (error) {
        console.log(error, "Ошибка useGetContactsUser")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchInterval: 60 * 1000 * 5,
  })
}

export const useGetDealsByDateRange = (userId: string, range: DateRange, departmentId: number) => {
  // const { authUser } = useStoreUser()
  return useQuery({
    queryKey: ["dealsByRange", userId, range, departmentId],
    queryFn: async () => {
      try {
        // if (!authUser?.id) {
        //   throw new Error("Пользователь не авторизован")
        // }

        return (await getDealsByDateRange(userId as string, range, departmentId)) ?? []
      } catch (error) {
        console.log(error, "Ошибка useGetProjectsUser")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!userId && !!departmentId && !!range,
    staleTime: 1000 * 60,
  })
}

export const useDealsUser = (type: TableType, userId?: string) => {
  const fetchers = {
    projects: useGetProjectsUser,
    retails: useGetRetailsUser,
    contracts: useGetContractsUser,
    project: useGetProjectsUser,
    retail: useGetRetailsUser,
    contract: useGetContractsUser,
  }

  if (!(type in fetchers)) {
    throw new Error(`Invalid deal type: ${type}`)
  }

  return fetchers[type](userId)
}

export const useGetAllDealsByType = (
  type: DealsUnionType,
  userId: string | null,
  departmentId: number,
) => {
  const projectsQuery = useGetAllProjects(userId, departmentId)
  const retailsQuery = useGetAllRetails(userId, departmentId)

  switch (type) {
    case "projects":
      return projectsQuery
    case "retails":
      return retailsQuery
    default:
      throw new Error(`Invalid deal type: ${type}`)
  }
}

export const useGetAdditionalContacts = (dealId: string) => {
  // const { authUser } = useStoreUser()
  return useQuery({
    queryKey: ["additionalContacts", dealId],
    queryFn: async () => {
      try {
        // if (!authUser?.id) {
        //   throw new Error("Пользователь не авторизован")
        // }

        if (!dealId) {
          TOAST.ERROR("Не удалось получить данные")
        }

        return (await getAdditionalContacts(dealId)) ?? []
      } catch (error) {
        console.log(error, "Ошибка useGetAdditionalContracts")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!dealId,
    staleTime: 1000 * 60,
  })
}

export const useGetAllDealsDepartment = () => {
  const { authUser } = useStoreUser()
  return useQuery({
    queryKey: ["all-deals-department", authUser?.departmentId, authUser?.id],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован")
        }

        return (await getAllDealsByDepartment(authUser?.departmentId)) ?? []
      } catch (error) {
        console.log(error, "Ошибка useGetProjectsUser")
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!authUser?.id && !!authUser?.departmentId,
    staleTime: 1000 * 60,
  })
}
