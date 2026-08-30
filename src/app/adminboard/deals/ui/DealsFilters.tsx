"use client"

import type { Table } from "@tanstack/react-table"
import dynamic from "next/dynamic"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"

const Filters = dynamic(() => import("./Filters"), {
  ssr: false,
  loading: () => <LoaderCircle />,
})

interface DealsFiltersProps<T = unknown> {
  table: Table<T>
  open: boolean
}

const DealsFilters = <T = unknown>({ table, open }: DealsFiltersProps<T>) => {
  return (
    <div
      className={`grid overflow-hidden transition-all duration-200 ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <Filters table={table as Table<unknown>} />
      </div>
    </div>
  )
}

export default DealsFilters
