"use client"

import { useRef, useState } from "react"
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable"
import { useGetAllDealsDepartment } from "@/feature/deals/api/hooks/query"
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider"
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage"
import { useTableState } from "@/shared/hooks/useTableState"
import { useVirtualizedRowTable } from "@/shared/hooks/useVirtualizedRowTable"
import { columnsDataDeals } from "@/widgets/deal/model/adminboard/columns-data-deals"
import DealsAllTable from "../ui/DealsAllTable"
import DealsDrawer from "../ui/DealsDrawer"
import DealsFilters from "../ui/DealsFilters"
import DealsToolbar from "../ui/DealsToolbar"
import Loading from "./loading"

const AllDealsPage = () => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null)
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)

  const { data, error, isError, isPending } = useGetAllDealsDepartment()
  const { table, filtersContextValue, openFilters, setGlobalFilter } = useTableState(
    data?.deals || [],
    columnsDataDeals,
    {
      resource: false,
      dealStatusP: false,
      dealStatusR: false,
    },
  )

  const { rows } = table.getRowModel()

  const { virtualItems, totalSize } = useVirtualizedRowTable({
    rows,
    tableContainerRef,
  })

  if (isPending) return <Loading />

  return (
    <section className="px-4 py-2 grid gap-2 content-start relative flex-1">
      {isError && <ErrorMessageTable message={error?.message} />}

      <TitlePageBlock
        infoText="Здесь вы можете удалять или переназначать клиентов между менеджерами."
        subTitle={`Количество сделок: ${data?.totalDealsCount}`}
        title="Список всех заявок"
      />

      <DataTableFiltersProvider value={filtersContextValue}>
        <DealsToolbar
          columns={columnsDataDeals}
          globalFilter={table.getState().globalFilter ?? ""}
          openFilters={openFilters}
          setGlobalFilter={setGlobalFilter}
          table={table}
          totalCount={data?.totalDealsCount ?? 0}
        />

        <DealsFilters open={openFilters} table={table} />
        <DealsAllTable
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
      {<DealsDrawer table={table} />}
    </section>
  )
}

export default AllDealsPage
