"use client"

import { useMemo, useRef, useState } from "react"
import type { Table } from "@tanstack/react-table"
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable"
import { useGetAllDealsDepartment } from "@/feature/deals/api/hooks/query"
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider"
import FiltersManagement from "@/feature/filter-persistence/ui/FiltersManagement"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage"
import { useTableState } from "@/shared/hooks/useTableState"
import { useVirtualizedRowTable } from "@/shared/hooks/useVirtualizedRowTable"
import { columnsDataDealsMarketing } from "@/widgets/deal/model/columns-data-deals-marketing"
import DealsAllTable from "@/widgets/deal/ui/DealsAllTable"
import Loading from "./loading"
import Filters from "./ui/Filters"

const HIDDEN_COLS = { id: false, user: false } as const

const AllDealsPage = () => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null)
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)

  const { data, error, isError, isPending } = useGetAllDealsDepartment(1)

  const deals = useMemo(() => data?.deals || [], [data?.deals])

  const { table, filtersContextValue, openFilters, setGlobalFilter } = useTableState(
    deals,
    columnsDataDealsMarketing,
    {
      hiddenColumns: HIDDEN_COLS,
      storageKey: "allDeals",
    },
  )

  const { rows } = table.getRowModel()

  const { virtualItems, totalSize } = useVirtualizedRowTable({
    rows,
    tableContainerRef,
  })

  const originalData = table.getCoreRowModel().rows.map((row) => row.original)

  if (isPending) return <Loading />

  return (
    <section className="px-4 py-2 grid gap-2 content-start relative flex-1">
      {isError && <ErrorMessageTable message={error?.message} />}

      <TitlePageBlock
        infoText=""
        subTitle={`Количество сделок: ${data?.totalDealsCount ?? 0}`}
        title="Список всех заявок"
      />

      <DataTableFiltersProvider value={filtersContextValue}>
        <div className="flex flex-wrap items-center gap-2">
          <DebouncedInput
            className="p-2 font-lg shadow border border-block"
            onChange={(v) => setGlobalFilter(String(v))}
            placeholder="Поиск..."
            value={table.getState().globalFilter ?? ""}
          />
          {/* 
             <DealsToolbar
            columns={columnsDataDealsMarketing}
            globalFilter={table.getState().globalFilter ?? ""}
            openFilters={openFilters}
            setGlobalFilter={setGlobalFilter}
            table={table}
            totalCount={data?.totalDealsCount ?? 0}
          /> */}

          {/* <div className="flex flex-wrap items-center gap-2"> */}
          {/* <p className="border rounded-md p-2">Количество заявок: {data?.totalDealsCount ?? 0}</p> */}

          {/* 
      <DebouncedInput
        className="p-2 font-lg shadow border border-block"
        onChange={(v) => setGlobalFilter(String(v))}
        placeholder="Поиск..."
        value={table.getState().globalFilter ?? ""}
      /> */}

          <FiltersManagement isShow={originalData.length > 0} openFilters={openFilters} />
        </div>

        <div
          className={`grid overflow-hidden transition-all duration-200 ${
            openFilters ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <Filters table={table as Table<unknown>} />
          </div>
        </div>
        <DealsAllTable
          canSelectRows={false}
          openFilters={openFilters}
          openFullInfoCell={openFullInfoCell}
          rows={rows}
          setOpenFullInfoCell={setOpenFullInfoCell}
          table={table}
          tableContainerRef={tableContainerRef}
          totalSize={totalSize}
          virtualItems={virtualItems}
        />
      </DataTableFiltersProvider>
    </section>
  )
}

export default AllDealsPage
