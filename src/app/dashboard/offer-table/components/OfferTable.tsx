"use client"

import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"
import SelectColumns from "@/shared/custom-components/ui/SelectColumns"
import { getLS, setLS } from "@/shared/hooks/useTableState"
import { cn, formatterCurrency } from "@/shared/lib/utils"
import RowNumber from "@/widgets/deal/model/columnsDataColsTemplate/RowNumber"
import {
  Cell,
  CellContext,
  ColumnDef,
  ColumnSizingInfoState,
  ColumnSizingState,
  flexRender,
  getCoreRowModel,
  Table,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { X } from "lucide-react"
import Image from "next/image"
import { ChangeEvent, memo, useEffect, useMemo, useState } from "react"
import SheetEquipment from "../sheetEquipment"
import { DataOffer, OfferTableItem, removeRow, updateRow, useOfferStoreTable } from "../store"

// const canHiddenColumns = ["purchasePrice", "purchaseAmount", "delta"] as const

// const colsListNotHidden = [
//   "name",
//   "description",
//   "price",
//   "count",
//   "totalPrice",
// ];

const OfferTable = ({
  dataParts,
  table,
  columnSizeVars,
}: {
  dataParts: DataOffer
  table: Table<OfferTableItem>
  columnSizeVars: Record<string, number>
}) => {
  return (
    <>
      <div className="h-screen overflow-y-auto relative p-10">
        <div></div>
        {dataParts.parts.map((part) => (
          <div className="relative w-full overflow-auto" key={part.id}>
            <div
              className="w-full grid border-separate border-spacing-0 border border-border"
              style={{
                ...columnSizeVars,
                width: table.getTotalSize(),
              }}
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 rounded-t-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <div key={headerGroup.id} className="flex">
                    {headerGroup.headers.map((header, index) => (
                      <div
                        key={header.id}
                        className={cn("p-2! border-zinc-600 border border-solid relative h-auto", {
                          "rounded-tr-sm": index === headerGroup.headers.length - 1,
                          "rounded-tl-sm": index === 0,
                        })}
                        style={{
                          width: `calc(var(--header-${header?.id}-size) * 1px)`,
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "grid content-between justify-items-center gap-1 h-full text-primary px-1 py-2",
                              // header.column.getCanSort() &&
                              //   "cursor-pointer select-none",
                            )}
                            // onClick={header.column.getToggleSortingHandler()}
                          >
                            <span className="text-wrap-pretty text-xs font-semibold first-letter:capitalize text-center">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                          </div>
                        )}
                        {header.column.getCanResize() && (
                          <div
                            onDoubleClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={cn("resizer", header.column.getIsResizing() && "isResizing")}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {/* <MemoizedTableBody
                table={table}
                columnVisibility={columnVisibility}
                columnSizing={columnSizing}
                dataTable={dataTable}
              />
              <TableBodyOffer table={table} />
              <TableFooterOffer table={table} /> */}
            </div>
            {/* <div className="absolute top-0 left-0 a4 border-dashed border-2 border-white" /> */}
          </div>
        ))}
      </div>
    </>
  )
}

export default OfferTable

const TableBodyOffer = ({
  table,
  columnSizing,
  columnVisibility,
  dataTable,
}: {
  table: Table<OfferTableItem>
  columnSizing: ColumnSizingState
  columnVisibility: VisibilityState
  dataTable: OfferTableItem[]
}) => {
  return (
    <>
      <div className="tbody">
        {table.getRowModel().rows.map((row) => {
          return (
            <div key={row.id} className="flex w-fit relative">
              <>
                {row.getVisibleCells().map((cell) => {
                  return <CellOfferTable key={cell.id} cell={cell} />
                })}

                {/* <Button
                  size="icon"
                  variant="destructive"
                  className="top-0 -right-10 absolute"
                  onClick={() => removeRow(row.original.id)}
                >
                  <X />
                </Button> */}
              </>
            </div>
          )
        })}
      </div>
    </>
  )
}

export const MemoizedTableBody = memo(TableBodyOffer, (prev, next) => {
  const sameData = prev.dataTable === next.dataTable

  const sameVisibility = prev.columnVisibility === next.columnVisibility

  return sameData && sameVisibility
}) as typeof TableBodyOffer

const TableFooterOffer = ({ table }: { table: Table<OfferTableItem> }) => {
  const { totalPriceOffer, totalPricePurchase, totalDelta } = useOfferStoreTable()
  return (
    <div className="tfooter flex">
      {table.getAllColumns().map((column) => {
        if (column.columnDef.meta?.hidden) return null
        return (
          <div
            key={column.id}
            className="p-2 td min-w-12 border-b border-r leading-none box-border min-h-[57px] relative overflow-hidden"
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

export const CellOfferTable = ({ cell }: { cell: Cell<OfferTableItem, unknown> }) => {
  const [value, setValue] = useState<string>((cell.getValue() as string) ?? "")

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setValue(e.target.value)
      const updateItem = {
        ...cell.row.original,
        [cell.column.id]: e.target.value,
      }
      updateRow(updateItem)
    }
  }

  return (
    <div
      key={cell.id}
      className="p-2 td min-w-12 border-b border-r leading-none box-border min-h-[57px] relative overflow-hidden"
      style={{
        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
      }}
    >
      <div className="grid gap-2 justify-items-center">
        {cell.column.id === "name" || cell.column.id === "description" ? (
          <Textarea value={value} onChange={handleChange} />
        ) : (
          <input
            value={value}
            onChange={handleChange}
            className="text-end w-full shadow-none border-none px-1 py-2"
          />
        )}
        {cell.column.id === "name" && cell.row.original.image && (
          <Image src={cell.row.original.image} alt="" width={80} height={80} />
        )}
      </div>
    </div>
  )
}
