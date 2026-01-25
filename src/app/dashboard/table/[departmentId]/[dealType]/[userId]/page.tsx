import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
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
