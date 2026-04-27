"use client"

import { memo, useEffect, useMemo, useState } from "react"
import type { Cell, ColumnSizingState, Table, VisibilityState } from "@tanstack/react-table"
import Image from "next/image"
import { Textarea } from "@/shared/components/ui/textarea"
import { type OfferTableItem, updateRow, useOfferStoreTable } from "../store"

// const canHiddenColumns = ["purchasePrice", "purchaseAmount", "delta"] as const

// const colsListNotHidden = [
//   "name",
//   "description",
//   "price",
//   "count",
//   "totalPrice",
// ];

const OfferTable = ({
  dataTable,
  table,
  columnSizing,
  columnVisibility,
  removeRow,
}: {
  dataTable: OfferTableItem[]
  table: Table<OfferTableItem>
  columnSizing: ColumnSizingState
  columnVisibility: VisibilityState
  removeRow: (rowId: string) => void
}) => {
  // const dataTable = useOfferStoreTable((state) => state.data.parts);
  return (
    <div className="overflow-y-auto relative">
      <div></div>

      <TableBodyOffer
        // columnSizing={columnSizing}
        // columnVisibility={columnVisibility}
        dataTable={dataTable}
        removeRow={removeRow}
        table={table}
      />
      {/* <TableBodyOffer table={table} />
      <TableFooterOffer table={table} />  */}
      {/* </div> */}
      {/* <div className="absolute top-0 left-0 a4 border-dashed border-2 border-white" /> */}
      {/* </div>
        ))} */}
    </div>
  )
}

export default OfferTable

const TableBodyOffer = memo(
  ({
    table,
    dataTable,
    removeRow,
  }: {
    table: Table<OfferTableItem>
    dataTable: OfferTableItem[]
    removeRow: (rowId: string) => void
  }) => {
    // Оптимальный поиск: берем готовые строки TanStack и оставляем только нужные этой секции
    // biome-ignore lint/correctness/useExhaustiveDependencies: <This is docstyle>
    const rows = useMemo(() => {
      return table
        .getRowModel()
        .rows.filter((row) => dataTable.some((d) => d.id === row.original.id))
    }, [table.getRowModel().rows, dataTable])

    return (
      <div className="tbody">
        {rows.map((row) => (
          <div className="flex relative group" key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <CellOfferTable cell={cell} key={cell.id} />
            ))}
            {/* Кнопка удаления */}
          </div>
        ))}
      </div>
    )
  },
)

// const TableBodyOffer = ({
//  table,
//   columnSizing,
//   columnVisibility,
//   dataTable,
//   removeRow,
// }: {
//   table: Table<OfferTableItem>;
//   columnSizing: ColumnSizingState;
//   columnVisibility: VisibilityState;
//   dataTable: OfferTableItem[];
//   removeRow: (rowId: string) => void;
// }) => {
//   const visibleColumns = table.getVisibleLeafColumns();

//   return (
//     <div className="tbody border-l">
//       {dataTable.map((rowData) => (
//         <div className="flex w-fit relative group" key={rowData.id}>
//           {/* Мапим не ячейки из RowModel, а видимые колонки таблицы */}
//           {visibleColumns.map((column) => {
//             return (
//               <ManualCell column={column} key={column.id} rowData={rowData} />
//             );
//           })}

//           <Button
//             className="opacity-0 group-hover:opacity-100 transition-opacity top-1 -right-10 absolute"
//             onClick={() => removeRow(rowData.id)}
//             size="icon"
//             variant="destructive"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export const MemoizedTableBody = memo(TableBodyOffer, (prev, next) => {
//   const sameData = prev.dataTable === next.dataTable;

//   const sameVisibility = prev.columnVisibility === next.columnVisibility;

//   return sameData && sameVisibility;
// }) as typeof TableBodyOffer;

const TableFooterOffer = ({ table }: { table: Table<OfferTableItem> }) => {
  const { totalPriceOffer, totalPricePurchase, totalDelta } = useOfferStoreTable()
  return (
    <div className="tfooter flex">
      {table.getAllColumns().map((column) => {
        if (column.columnDef.meta?.hidden) return null
        return (
          <div
            className="p-2 td min-w-12 border-b border-r leading-none box-border min-h-[57px] relative overflow-hidden"
            key={column.id}
            style={{
              width: `calc(var(--col-${column.id}-size) * 1px)`,
            }}
          >
            <span className="text-end">
              {column.id === "totalPrice" && totalPriceOffer}
              {column.id === "purchaseAmount" && totalPricePurchase}
              {column.id === "delta" && totalDelta}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export const CellOfferTable = memo(({ cell }: { cell: Cell<OfferTableItem, unknown> }) => {
  // 1. Сохраняем твою логику инициализации
  const initialValue = (cell.getValue() as string) ?? ""
  const [value, setValue] = useState<string>(initialValue)

  // Синхронизация стейта (чтобы данные не "залипали" при обновлении стора)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // 2. Оптимизация: сохраняем в стор только при выходе (onBlur)
  // Это уберет бесконечный рендеринг при печати
  const handlePersist = () => {
    if (value !== initialValue) {
      const updateItem = {
        ...cell.row.original,
        [cell.column.id]: value,
      }
      updateRow(updateItem) // Вызываем твой экшен
    }
  }

  return (
    <div
      className="p-2 td min-w-12 border-b border-r leading-none box-border min-h-[57px] relative overflow-hidden"
      key={cell.id}
      style={{ width: `calc(var(--col-${cell.column.id}-size) * 1px)` }}
    >
      <div className="grid gap-2 justify-items-center">
        {/* Твоя логика выбора инпута или текстареа */}
        {cell.column.id === "name" || cell.column.id === "description" ? (
          <Textarea
            onBlur={handlePersist}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        ) : (
          <input
            className="text-end w-full shadow-none border-none px-1 py-2 bg-transparent"
            onBlur={handlePersist}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        )}

        {/* ТВОЙ ФУНКЦИОНАЛ С КАРТИНКАМИ — СОХРАНЕН */}
        {cell.column.id === "name" && cell.row.original.image && (
          <Image
            alt=""
            className="object-contain"
            height={80}
            src={cell.row.original.image}
            width={80}
          />
        )}
      </div>
    </div>
  )
})
