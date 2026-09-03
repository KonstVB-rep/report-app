import { Suspense } from "react"
import type { Metadata } from "next"
import { getAllDealsRequestSourceByDepartment } from "@/entities/deal/api/deal.actions"
import Loading from "./loading"
import Charts from "./ui/Charts"

export const metadata: Metadata = {
  title: "Источники заявок",
}

export const instant = false

async function ChartsDataLoader({ depId }: { depId: number }) {
  const data = await getAllDealsRequestSourceByDepartment(depId)

  if (!data?.deals.length) return <p>Нет данных</p>

  return <Charts data={data} />
}

export default function RequestSourcePage() {
  return (
    <div className="px-4 py-2 h-full min-h-[calc(100svh-var(--header-height)-2px)] max-h-[calc(100svh-var(--header-height)-2px)] overflow-y-auto">
      <Suspense fallback={<Loading />}>
        <ChartsDataLoader depId={1} />
      </Suspense>
    </div>
  )
}
