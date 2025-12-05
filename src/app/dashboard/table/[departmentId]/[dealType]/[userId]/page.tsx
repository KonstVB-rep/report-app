import { getQueryClient } from "@/app/provider/query-provider"
import {
  getContractsUserQuery,
  getProjectsUserQuery,
  getRetailsUserQuery,
} from "@/entities/deal/api/queryFn"
import { dehydrate, HydrationBoundary, type QueryClient } from "@tanstack/react-query"

import { ProjectResponse, RetailResponse } from "@/entities/deal/types"
import PersonDealsTable from "@/widgets/deal/ui/PersonDealsTable"

const QUERY_CONFIG: Record<
  string,
  (id: string) => Promise<ProjectResponse[] | RetailResponse[] | null>
> = {
  projects: getProjectsUserQuery,
  retails: getRetailsUserQuery,
  contracts: getContractsUserQuery,
}

const USER_ID_TYPES = new Set(["projects", "retails", "contracts"])

const PersonTablePage = async ({
  params,
}: {
  params: Promise<{ dealType: string; userId: string; departmentId: string }>
}) => {
  const { dealType, userId, departmentId } = await params
  const queryClient = getQueryClient()

  const id = USER_ID_TYPES.has(dealType) ? userId : departmentId

  const queryFn = QUERY_CONFIG[dealType]

  if (queryFn) {
    await queryClient.prefetchQuery({
      queryKey: [dealType, id],
      queryFn: () => queryFn(id),
      staleTime: 30 * 1000,
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PersonDealsTable />
    </HydrationBoundary>
  )
}

export default PersonTablePage
