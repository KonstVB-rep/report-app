import type { DealType } from "@prisma/client"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  getAdditionalContacts,
  getAllDealsByDepartment,
  getAllProjectsByDepartment,
  getAllRetailsByDepartment,
  getDealsByDateRange,
  getProjectById,
  getProjectsUser,
  getRetailById,
  getRetailsUser,
} from "@/entities/deal/api/deal.actions"
import {
  type DateRange,
  DEAL_TYPE,
  type DealProject,
  type DealRetail,
  type DealsList,
  type DealsUnionType,
  type DealUnion,
  type ProjectResponse,
  type RetailResponse,
  type TableType,
} from "@/entities/deal/types"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import { REFETCH_INTERVAL } from "@/shared/types"

const emptyQueryResult = {
  data: undefined,
  isLoading: true,
  isError: false,
  error: null,
}

export const queryKeys = {
  projectById: (id: string) => ["project", id] as const,
  retailById: (id: string) => ["retail", id] as const,
  dealById: (type: DealType, id: string, userId?: string) =>
    [`${type.toLowerCase()}_deal`, id, userId] as const,
  allProjects: (departmentId: number) => ["all-projects", departmentId] as const,
  allRetails: (departmentId: number) => ["all-retails", departmentId] as const,
  retailsUser: (userId?: string) => ["retails", userId] as const,
  projectsUser: (userId?: string) => ["projects", userId] as const,
  contractsUser: (userId?: string) => ["contracts", userId] as const,
  dealsByRange: (userId: string, range: DateRange, departmentId: number) =>
    ["dealsByRange", userId, range, departmentId] as const,
  additionalContacts: (dealId: string) => ["additionalContacts", dealId] as const,
  allDealsDepartment: (departmentId: number) => ["all-deals-department", departmentId] as const,
}

export const useGetProjectById = <T extends DealProject>(
  dealId: string,
  useCache: boolean = true,
) => {
  const { queryClient, authUser } = useFormSubmission()

  const cachedDeals = authUser?.id
    ? queryClient.getQueryData<DealProject[]>(["projects", authUser?.id])
    : undefined
  const cachedDeal = cachedDeals?.find((p) => p.id === dealId) as T | undefined

  const isEnabled = !!dealId && !!authUser?.id && (!useCache || !cachedDeal)

  return useQuery<T, Error>({
    queryKey: queryKeys.projectById(dealId),
    queryFn: async () => ((await getProjectById(dealId)) as T) ?? null,
    enabled: isEnabled,
    initialData: () => cachedDeal,
    staleTime: useCache ? 60 * 1000 : 0,
    placeholderData: keepPreviousData,
    retry: 2,
  })
}

export const useGetRetailById = <T extends DealRetail>(
  dealId: string,
  useCache: boolean = true,
) => {
  const { queryClient, authUser } = useFormSubmission()

  const cachedDeals = authUser?.id
    ? queryClient.getQueryData<DealRetail[]>(["retails", authUser.id])
    : undefined
  const cachedDeal = cachedDeals?.find((p) => p.id === dealId) as T | undefined

  const isEnabled = !!authUser?.id && (!useCache || !cachedDeal)

  return useQuery<T, Error>({
    queryKey: queryKeys.retailById(dealId),
    queryFn: async () => ((await getRetailById(dealId)) as T) ?? null,
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    staleTime: useCache ? 60 * 1000 : 0,
    retry: 2,
  })
}

type FetchFunctionMap = {
  [key in DealType]: (id: string) => Promise<DealUnion | null>
}

const fetchFunctions: Partial<FetchFunctionMap> = {
  [DEAL_TYPE.PROJECT]: getProjectById,
  [DEAL_TYPE.RETAIL]: getRetailById,
}

export const useGetDealById = <T extends DealUnion>(dealId: string, type: DealType) => {
  const { queryClient, authUser } = useFormSubmission()

  const queryKey = queryKeys.dealById(type, dealId, authUser?.id)

  const cachedData = queryClient.getQueryData<DealUnion[]>([`${type.toLowerCase()}s`, authUser?.id])
  const cachedEntity = cachedData?.find((p) => p.id === dealId) as T | undefined

  const isEnabled = !!dealId && !!authUser?.id

  const fetchFn = async (): Promise<T> => {
    const fetcher = fetchFunctions[type]
    if (!fetcher) {
      throw new Error(`Нет функции для типа сделки: ${type}`)
    }

    const entity = await fetcher(dealId)
    return entity as T
  }

  return useQuery<T, Error>({
    queryKey,
    queryFn: fetchFn,
    enabled: isEnabled,
    initialData: () => cachedEntity,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
export const useGetAllProjects = <T extends ProjectResponse[]>(
  userId: string | null,
  departmentId: number,
) => {
  const { authUser } = useStoreUser()

  const isEnabled = !!userId && !!departmentId && !!authUser?.id

  return useQuery<T, Error>({
    queryKey: queryKeys.allProjects(departmentId),
    queryFn: async () => {
      return ((await getAllProjectsByDepartment(departmentId)) as T) ?? []
    },
    enabled: isEnabled,
    retry: 2,
    staleTime: 1000 * 60,
    refetchInterval: REFETCH_INTERVAL,
    placeholderData: keepPreviousData,
  })
}

export const useGetAllRetails = <T extends RetailResponse[]>(
  userId: string | null,
  departmentId: number,
) => {
  const isEnabled = !!userId && !!departmentId

  return useQuery<T, Error>({
    queryKey: queryKeys.allRetails(departmentId),
    queryFn: async () => {
      return ((await getAllRetailsByDepartment(departmentId)) as T) ?? []
    },
    enabled: isEnabled,
    staleTime: 1000 * 60,
    refetchInterval: REFETCH_INTERVAL,
    placeholderData: keepPreviousData,
  })
}

export const useGetRetailsUser = <T extends RetailResponse[]>(userId: string | undefined) => {
  return useQuery<T, Error>({
    queryKey: queryKeys.retailsUser(userId),
    queryFn: async () => {
      return ((await getRetailsUser(userId as string)) as T) ?? []
    },
    enabled: !!userId,
    placeholderData: undefined,
    staleTime: 1000 * 60,
    refetchInterval: REFETCH_INTERVAL,
    meta: {
      errorMessage: "Не удалось загрузить список проектов",
    },
  })
}

export const useGetProjectsUser = <T extends ProjectResponse[]>(userId: string | undefined) => {
  const isEnabled = !!userId

  return useQuery<T, Error>({
    queryKey: queryKeys.projectsUser(userId),
    queryFn: async () => {
      if (!userId) throw new Error("userId is required")
      return ((await getProjectsUser(userId)) as T) ?? []
    },
    enabled: isEnabled,
    staleTime: REFETCH_INTERVAL,
    meta: {
      errorMessage: "Не удалось загрузить список проектов",
    },
  })
}

export const useGetContractsUser = <T extends ProjectResponse[]>(userId: string | undefined) => {
  return useQuery<T, Error>({
    queryKey: queryKeys.contractsUser(userId),
    queryFn: async () => {
      return ((await getProjectsUser(userId as string)) as T) ?? []
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchInterval: REFETCH_INTERVAL,
    meta: {
      errorMessage: "Не удалось загрузить список проектов",
    },
  })
}

export const useGetDealsByDateRange = (userId: string, range: DateRange, departmentId: number) => {
  const isEnabled = !!userId && !!departmentId && !!range
  return useQuery({
    queryKey: queryKeys.dealsByRange(userId, range, departmentId),
    queryFn: async () => {
      return (await getDealsByDateRange(userId as string, range, departmentId)) ?? []
    },
    enabled: isEnabled,
    staleTime: 1000 * 60,
  })
}

export const useDealsUser = (type: TableType | undefined, userId?: string) => {
  const projects = useGetProjectsUser(userId)

  const retails = useGetRetailsUser(userId)

  const contracts = useGetContractsUser(userId)
  if (!type) return emptyQueryResult

  switch (type) {
    case "projects":
      return projects
    case "retails":
      return retails
    case "contracts":
      return contracts
  }
}

export const useGetAllDealsByType = (
  type: DealsUnionType | null,
  userId: string | null,
  departmentId: number,
) => {
  const projects = useGetAllProjects(userId, departmentId)
  const retails = useGetAllRetails(userId, departmentId)

  if (!type) return emptyQueryResult

  switch (type) {
    case "projects":
      return projects
    case "retails":
      return retails
  }
}

export const useGetAdditionalContacts = (dealId: string) => {
  return useQuery({
    queryKey: queryKeys.additionalContacts(dealId),
    queryFn: async () => {
      return (await getAdditionalContacts(dealId)) ?? []
    },
    enabled: !!dealId,
    staleTime: 1000 * 60,
  })
}

export const useGetAllDealsDepartment = <T extends DealsList>(departmentId: number) => {
  const isEnabled = !!departmentId
  return useQuery<T, Error>({
    queryKey: queryKeys.allDealsDepartment(departmentId),
    queryFn: async () => {
      return ((await getAllDealsByDepartment(departmentId)) as T) ?? []
    },
    enabled: isEnabled,
    staleTime: 1000 * 60,
  })
}
