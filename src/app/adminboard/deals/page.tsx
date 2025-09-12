// app/adminboard/all-deals/page.tsx
'use client'

import { useRef, useState } from 'react'
import { useGetAllDealsDepartment } from '@/feature/deals/api/hooks/query'
import { useTableState } from '@/shared/hooks/useTableState'
import { useVirtualizedRowTable } from '@/shared/hooks/useVirtualizedRowTable'
import { columnsDataDeals } from '@/widgets/deal/model/adminboard/columns-data-deals'

import DealTableTemplate from '@/entities/deal/ui/DealTableTemplate'
import ErrorMessageTable from '@/entities/deal/ui/ErrorMessageTable'
import Loading from '../loading'

import DealsToolbar from './ui/DealsToolbar'
import DealsFilters from './ui/DealsFilters'
import { DataTableFiltersProvider } from '@/feature/filter-persistence/context/DataTableFiltersProvider'
import DealsAllTable from './ui/DealsAllTable'

const AllDealsPage = () => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null)
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)

  const { data, error, isError, isPending } = useGetAllDealsDepartment()
  const { table, filtersContextValue, openFilters, setGlobalFilter } =
    useTableState(data?.deals || [], columnsDataDeals)

  const { rows } = table.getRowModel()
  const { virtualItems, totalSize } = useVirtualizedRowTable({
    rows,
    tableContainerRef,
  })

  if (isPending) return <Loading />

  return (
    <DealTableTemplate>
      {isError && <ErrorMessageTable message={error?.message} />}

      <DealsToolbar
        totalCount={data?.totalDealsCount ?? 0}
        table={table}
        columns={columnsDataDeals}
        globalFilter={table.getState().globalFilter ?? ''}
        setGlobalFilter={setGlobalFilter}
      />

      <DataTableFiltersProvider value={filtersContextValue}>
        <DealsFilters table={table} open={openFilters} />
        <DealsAllTable
          table={table}
          rows={rows}
          virtualItems={virtualItems}
          totalSize={totalSize}
          openFullInfoCell={openFullInfoCell}
          setOpenFullInfoCell={setOpenFullInfoCell}
          tableContainerRef={tableContainerRef}
        />
      </DataTableFiltersProvider>
    </DealTableTemplate>
  )
}

export default AllDealsPage
