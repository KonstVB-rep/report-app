// app/.../page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/app/provider/query-provider"
import {
  getAllProjectsByDepartmentQuery,
  getAllRetailsByDepartmentQuery,
} from "@/entities/deal/api/queryFn"
import SummaryDealsTable from "@/widgets/deal/ui/SummaryDealsTable"

const SummaryTablePage = async ({
  params,
}: {
  params: Promise<{ dealType: string; userId: string; departmentId: string }>
}) => {
  const { dealType, departmentId: depIdStr } = await params
  const departmentId = Number(depIdStr)

  const queryClient = getQueryClient()

  if (dealType === "projects") {
    await queryClient.prefetchQuery({
      queryKey: ["all-projects", departmentId],
      queryFn: () => getAllProjectsByDepartmentQuery(departmentId),
    })
  } else if (dealType === "retails") {
    await queryClient.prefetchQuery({
      queryKey: ["all-retails", departmentId],
      queryFn: () => getAllRetailsByDepartmentQuery(departmentId),
    })
  }

  return (
    // Передаем состояние кэша в клиентские компоненты
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SummaryDealsTable />
    </HydrationBoundary>
  )
}

export default SummaryTablePage
