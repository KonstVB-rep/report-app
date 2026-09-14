import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/app/provider/query-provider"
import { getAllDealsByDepartment } from "@/entities/deal/api/deal.actions"
import AllDealsPage from "./DealsDashboard"

export const instant = false

const RequestSourcePage = async () => {
  const queryClient = getQueryClient()

  await queryClient.query({
    queryKey: ["allDealsDepartment", 1],
    queryFn: () => getAllDealsByDepartment(1),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AllDealsPage />
    </HydrationBoundary>
  )
}

export default RequestSourcePage
