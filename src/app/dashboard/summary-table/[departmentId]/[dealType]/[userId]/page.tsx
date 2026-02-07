import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { getQueryClient } from "@/app/provider/query-provider"
import {
  getAllProjectsByDepartment,
  getAllRetailsByDepartment,
} from "@/entities/deal/api/deal.actions"
import type { ProjectResponse, RetailResponse } from "@/entities/deal/types"
import SummaryDealsTable from "@/widgets/deal/ui/SummaryDealsTable"

type DealResponse = ProjectResponse[] | RetailResponse[]

const DEAL_RESOLVER = {
  projects: {
    fetcher: getAllProjectsByDepartment,
    key: "all-projects",
  },
  retails: {
    fetcher: getAllRetailsByDepartment,
    key: "all-retails",
  },
} as const

type DealTypeTable = keyof typeof DEAL_RESOLVER

const SummaryTablePage = async ({
  params,
}: {
  params: Promise<{ dealType: string; userId: string; departmentId: string }>
}) => {
  const { dealType, departmentId } = await params
  const depNumId = Number(departmentId)

  if (Number.isNaN(depNumId)) {
    return notFound()
  }

  if (!(dealType in DEAL_RESOLVER)) {
    return notFound()
  }

  const currentType = dealType as DealTypeTable
  const strategy = DEAL_RESOLVER[currentType]
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery<DealResponse>({
    queryKey: [strategy.key, depNumId],
    queryFn: () => strategy.fetcher(depNumId) as Promise<DealResponse>,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SummaryDealsTable />
    </HydrationBoundary>
  )
}

export default SummaryTablePage
