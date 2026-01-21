// import { Suspense } from "react"
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
// import { getQueryClient } from "@/app/provider/query-provider"
// import {
//   getContractsUserQuery,
//   getProjectsUserQuery,
//   getRetailsUserQuery,
// } from "@/entities/deal/api/queryFn"
// import type { ProjectResponse, RetailResponse } from "@/entities/deal/types"
// import PersonDealsTable from "@/widgets/deal/ui/PersonDealsTable"

// const QUERY_CONFIG: Record<
//   string,
//   (id: string) => Promise<ProjectResponse[] | RetailResponse[] | null>
// > = {
//   projects: getProjectsUserQuery,
//   retails: getRetailsUserQuery,
//   contracts: getContractsUserQuery,
// }

// const USER_ID_TYPES = new Set(["projects", "retails", "contracts"])

// const PersonTablePage = async ({
//   params,
// }: {
//   params: Promise<{ dealType: string; userId: string; departmentId: string }>
// }) => {
//   const { dealType, userId, departmentId } = await params
//   const queryClient = getQueryClient()

//   const id = USER_ID_TYPES.has(dealType) ? userId : departmentId

//   const queryFn = QUERY_CONFIG[dealType]

//   if (queryFn) {
//     await queryClient.prefetchQuery({
//       queryKey: [dealType, id],
//       queryFn: () => queryFn(id),
//       staleTime: 30 * 1000,
//     })
//   }

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <Suspense fallback={<div>Загрузка данных...</div>}>
//         <PersonDealsTable />
//       </Suspense>
//     </HydrationBoundary>
//   )
// }

import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
// export default PersonTablePage
import { notFound } from "next/navigation"
import { getQueryClient } from "@/app/provider/query-provider"
import {
  getContractsUserQuery,
  getProjectsUserQuery,
  getRetailsUserQuery,
} from "@/entities/deal/api/queryFn"
import type { ProjectResponse, RetailResponse } from "@/entities/deal/types" // Импортируем типы
import PersonDealsTable from "@/widgets/deal/ui/PersonDealsTable"

type DealResponse = ProjectResponse[] | RetailResponse[] | null

const DEAL_RESOLVER = {
  projects: {
    fetcher: getProjectsUserQuery,
    getId: (p: { userId: string }) => p.userId,
    title: "Проекты",
  },
  retails: {
    fetcher: getRetailsUserQuery,
    getId: (p: { userId: string }) => p.userId,
    title: "Розница",
  },
  contracts: {
    fetcher: getContractsUserQuery,
    getId: (p: { userId: string }) => p.userId,
    title: "Договоры",
  },
} as const

type DealTypeTable = keyof typeof DEAL_RESOLVER

interface PageProps {
  params: Promise<{
    dealType: string
    userId: string
    departmentId: string
  }>
}

export default async function PersonTablePage({ params }: PageProps) {
  const resolvedParams = await params
  const { dealType } = resolvedParams

  if (!(dealType in DEAL_RESOLVER)) {
    notFound()
  }

  const currentType = dealType as DealTypeTable
  const strategy = DEAL_RESOLVER[currentType]
  const queryClient = getQueryClient()
  const targetId = strategy.getId(resolvedParams)

  await queryClient.prefetchQuery<DealResponse>({
    queryKey: [currentType, targetId],
    queryFn: () => strategy.fetcher(targetId) as Promise<DealResponse>,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="h-full w-full p-4">
        <PersonDealsTable />
      </main>
    </HydrationBoundary>
  )
}
