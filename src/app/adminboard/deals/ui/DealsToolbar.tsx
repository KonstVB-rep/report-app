"use client";

import { ColumnDef, Table } from "@tanstack/react-table";

import { DealBase } from "@/entities/deal/types";
import FiltersManagement from "@/feature/filter-persistence/ui/FiltersManagement";
import ButtonExportTableXls from "@/feature/table-export-excel/ui/ButtonExportTableXls";
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput";

const DealsToolbar = ({
  totalCount,
  table,
  columns,
  globalFilter,
  setGlobalFilter,
  openFilters,
}: {
  totalCount: number;
  table: Table<DealBase>;
  columns: ColumnDef<DealBase>[];
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  openFilters: boolean;
}) => {
  const originalData = table.getCoreRowModel().rows.map((row) => row.original);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="border rounded-md p-2">Количество заявок: {totalCount}</p>

      <ButtonExportTableXls
        isShow={table.getRowModel().rows.length > 0}
        table={table}
        columns={columns}
      />

      <DebouncedInput
        value={globalFilter}
        onChange={(v) => setGlobalFilter(String(v))}
        className="p-2 font-lg shadow border border-block"
        placeholder="Поиск..."
      />

      <FiltersManagement
        openFilters={openFilters}
        isShow={originalData.length > 0}
      />
    </div>
  );
};

export default DealsToolbar;
