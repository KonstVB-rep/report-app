"use client";

import { ColumnDef, Table } from "@tanstack/react-table";

import { DealBase } from "@/entities/deal/types";
import ButtonExportTableXls from "@/feature/table-export-excel/ui/ButtonExportTableXls";
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput";

const DealsToolbar = ({
  totalCount,
  table,
  columns,
  globalFilter,
  setGlobalFilter,
}: {
  totalCount: number;
  table: Table<DealBase>;
  columns: ColumnDef<DealBase>[];
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
}) => (
  <div className="flex flex-wrap gap-2 mb-2">
    <p className="border rounded-md p-2">
      Общее количество заявок: {totalCount}
    </p>

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
  </div>
);

export default DealsToolbar;
