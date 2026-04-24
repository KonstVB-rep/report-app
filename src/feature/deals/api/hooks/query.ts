import type { DealType } from "@prisma/client"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  getAdditionalContacts,
  getAllDealsByDepartment,
  getAllProjectsByDepartment,
  getAllRetailsByDepartment,
  getDealsByDateRange,
  getHilightList,
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
  type TableType,
} from "@/entities/deal/types"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import { ERROR_TEXT, REFETCH_INTERVAL, REFETCH_INTERVAL_SUMMARY_TABLE } from "@/shared/types"

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
  colorsHiLightList: (userId: string) => ["hilightlist", userId] as const,
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
    meta: {
      errorMessage: ERROR_TEXT,
    },
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
    meta: {
      errorMessage: ERROR_TEXT,
    },
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
    meta: {
      errorMessage: ERROR_TEXT,
    },
  })
}

const DEAL_QUERY_CONFIG = {
  projects: {
    queryKey: (userId: string) => queryKeys.projectsUser(userId),
    fetcher: getProjectsUser,
  },
  retails: {
    queryKey: (userId: string) => queryKeys.retailsUser(userId),
    fetcher: getRetailsUser,
  },
  contracts: {
    queryKey: (userId: string) => queryKeys.contractsUser(userId),
    fetcher: getProjectsUser,
  },
} as const

export const useDealsUser = (type: TableType | undefined, userId?: string) => {
  const isEnabled = !!type && !!userId

  return useQuery({
    queryKey: isEnabled ? DEAL_QUERY_CONFIG[type].queryKey(userId) : ["deals", "disabled"],

    queryFn: async () => {
      if (!type || !userId) throw new Error("Missing params")

      const fetcher = DEAL_QUERY_CONFIG[type].fetcher
      const data = await fetcher(userId)

      return data ?? []
    },

    enabled: isEnabled,
    staleTime: REFETCH_INTERVAL,
    placeholderData: keepPreviousData,
    meta: {
      errorMessage: ERROR_TEXT,
    },
  })
}

const DEAL_SUMMARY_QUERY_CONFIG = {
  projects: {
    queryKey: (departmentId: number) => queryKeys.allProjects(departmentId),
    fetcher: getAllProjectsByDepartment,
  },
  retails: {
    queryKey: (departmentId: number) => queryKeys.allRetails(departmentId),
    fetcher: getAllRetailsByDepartment,
  },
} as const

export const useGetAllDealsByType = (
  type: DealsUnionType | null,
  userId: string | null,
  departmentId: number,
) => {
  const isEnabled = !!userId && !!departmentId && !!type

  return useQuery({
    queryKey: isEnabled
      ? DEAL_SUMMARY_QUERY_CONFIG[type].queryKey(departmentId)
      : ["all-deals", "disabled"],
    queryFn: async () => {
      if (!type || !userId) throw new Error("Отсутствует обязательный параметр запроса!")

      const fetcher = DEAL_SUMMARY_QUERY_CONFIG[type].fetcher
      const data = await fetcher(departmentId)

      return data ?? []
    },
    enabled: isEnabled,
    staleTime: 1000 * 60,
    refetchInterval: REFETCH_INTERVAL_SUMMARY_TABLE,
    placeholderData: keepPreviousData,
    meta: {
      errorMessage: ERROR_TEXT,
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
    meta: {
      errorMessage: ERROR_TEXT,
    },
  })
}

export const useGetAdditionalContacts = (dealId: string) => {
  return useQuery({
    queryKey: queryKeys.additionalContacts(dealId),
    queryFn: async () => {
      return (await getAdditionalContacts(dealId)) ?? []
    },
    enabled: !!dealId,
    staleTime: 1000 * 60,
    meta: {
      errorMessage: ERROR_TEXT,
    },
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
    meta: {
      errorMessage: ERROR_TEXT,
    },
  })
}

export const useGetHilightList = () => {
  const { authUser } = useFormSubmission()
  const isEnabled = !!authUser
  return useQuery({
    queryKey: queryKeys.colorsHiLightList(authUser?.id || ""),
    queryFn: async () => {
      return await getHilightList()
    },
    enabled: isEnabled,
  })
}
