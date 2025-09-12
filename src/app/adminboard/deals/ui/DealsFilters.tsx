// components/deals/DealsFilters.tsx
'use client'
import dynamic from 'next/dynamic'
import { LoaderCircle } from '@/shared/custom-components/ui/Loaders'
import { Table } from '@tanstack/react-table'
import { DealBase } from '@/entities/deal/types'

const Filters = dynamic(() => import('./Filters'), {
  ssr:false,
  loading: () => <LoaderCircle/>
})

const DealsFilters = ({ table, open }: { table: Table<DealBase>; open: boolean }) => (
  <div className={`grid overflow-hidden transition-all duration-200 ${open ? 'grid-rows-[1fr] pb-2' : 'grid-rows-[0fr]'}`}>
    {open && <Filters table={table} />}
  </div>
)

export default DealsFilters
