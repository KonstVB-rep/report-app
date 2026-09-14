import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { connection } from "next/server"
import { getQueryClient } from "@/app/provider/query-provider"
import { getAllDealsByDepartment } from "@/entities/deal/api/deal.actions"
import AllDealsPage from "./DealsDashboard"

interface PageProps {
  params: Promise<{
    departmentId: string
    userId: string
  }>
}

const RequestSourcePage = async ({ params }: PageProps) => {
  await connection()

  const queryClient = getQueryClient()

  const resolvedParams = await params
  const deptId = Number(resolvedParams.departmentId) || 1

  await queryClient.query({
    queryKey: ["allDealsDepartment", deptId],
    queryFn: () => getAllDealsByDepartment(deptId),
  })

  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(queryClient)))

  return (
    <HydrationBoundary state={dehydratedState}>
      <AllDealsPage />
    </HydrationBoundary>
  )
}

export default RequestSourcePage
