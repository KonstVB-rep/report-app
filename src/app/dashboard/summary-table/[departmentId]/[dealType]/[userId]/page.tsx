import { Suspense } from "react"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { getQueryClient } from "@/app/provider/query-provider"
import {
  getAllProjectsByDepartmentQuery,
  getAllRetailsByDepartmentQuery,
} from "@/entities/deal/api/queryFn"
import type { ProjectResponse, RetailResponse } from "@/entities/deal/types"
import { LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"
import SummaryDealsTable from "@/widgets/deal/ui/SummaryDealsTable"

const QUERY_CONFIG: Record<
  string,
  {
    fn: (id: number) => Promise<ProjectResponse[] | RetailResponse[]>
    key: string
  }
> = {
  projects: {
    fn: getAllProjectsByDepartmentQuery,
    key: "all-projects",
  },
  retails: {
    fn: getAllRetailsByDepartmentQuery,
    key: "all-retails",
  },
}

const SummaryTablePage = async ({
  params,
}: {
  params: Promise<{ dealType: string; userId: string; departmentId: string }>
}) => {
  const { dealType, departmentId: depIdStr } = await params
  const departmentId = Number(depIdStr)

  if (Number.isNaN(departmentId)) {
    return notFound()
  }

  const queryConfig = QUERY_CONFIG[dealType]

  if (!queryConfig) {
    notFound()
  }

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: [queryConfig.key, departmentId],
    queryFn: () => queryConfig.fn(departmentId),
    staleTime: 60 * 1000,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoaderCircleInWater />}>
        <SummaryDealsTable />
      </Suspense>
    </HydrationBoundary>
  )
}

export default SummaryTablePage
