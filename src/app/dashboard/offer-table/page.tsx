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
import SheetEquipment from "./sheetEquipment"
import { removeRow, updateRow, useOfferStoreTable } from "./store"

type OfferTableItem = {
  id: string | number
  name: string
  image?: string
  description: string
  price: string
  count?: number
  totalPrice?: string
  purchasePrice?: string
  purchaseAmount?: string
  delta?: string
}

// const canHiddenColumns = ["purchasePrice", "purchaseAmount", "delta"] as const
const defaultColumns: ColumnDef<OfferTableItem>[] = [
  {
    ...RowNumber<OfferTableItem>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: OfferTableItem) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  {
    id: "name",
    header: "Наименование",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = info.getValue()
      return value
    },
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: OfferTableItem) => row.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = info.getValue()
      return value
    },
    meta: {
      title: "Описание",
    },
    accessorFn: (row: OfferTableItem) => row.description,
  },
  {
    id: "price",
    header: "Цена",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      return formatterCurrency.format(parseFloat(info.getValue() as string))
    },
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    accessorFn: (row: OfferTableItem) => row.price,
  },
  {
    id: "count",
    header: "Количество",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      return info.getValue()
    },
    enableHiding: true,
    meta: {
      title: "Количество",
    },
    accessorFn: (row: OfferTableItem) => row.count,
  },
  {
    id: "totalPrice",
    header: "Итого, руб.",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      return formatterCurrency.format(parseFloat(info.getValue() as string))
    },
    enableHiding: true,
    meta: {
      title: "Итого, руб.",
    },
    accessorFn: (row: OfferTableItem) => row.totalPrice,
  },
  {
    id: "purchasePrice",
    header: "Цена закупки",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = formatterCurrency.format(parseFloat(info.getValue() as string))
      return <div>{value}</div>
    },
    enableHiding: true,
    meta: {
      title: "Цена закупки",
    },
    accessorFn: (row: OfferTableItem) => row.purchasePrice,
  },
  {
    id: "purchaseAmount",
    header: "Сумма закупки",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = formatterCurrency.format(parseFloat(info.getValue() as string))
      return <div>{value}</div>
    },
    enableHiding: true,
    meta: {
      title: "Сумма закупки",
    },
    accessorFn: (row: OfferTableItem) => row.purchaseAmount,
  },
  {
    id: "delta",
    header: "Дельта",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = formatterCurrency.format(parseFloat(info.getValue() as string))
      return <div>{value}</div>
    },
    enableHiding: true,
    meta: {
      title: "Дельта",
    },
    accessorFn: (row: OfferTableItem) => row.delta,
  },
]

const storageKey = "offer-table"

const colsListNotHidden = ["name", "description", "price", "count", "totalPrice"]

const OfferTable = () => {
  const dataTable = useOfferStoreTable((state) => state.dataTable)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    rowNumber: false,
  })

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() =>
    getLS(`${storageKey}_columnSizing`, {}),
  )

  const [_columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>(
    {} as ColumnSizingInfoState,
  )

  useEffect(() => {
    setLS(`${storageKey}_columnSizing`, columnSizing)
  }, [columnSizing, storageKey])

  const columns = useMemo(() => defaultColumns, [])

  const table = useReactTable({
    data: dataTable,
    columns,
    state: {
      columnVisibility,
      columnSizing,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onColumnSizingInfoChange: setColumnSizingInfo,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    columnResizeMode: "onChange",
  })

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.getState().columnSizingInfo, table.getState().columnSizing])

  return (
    <>
      <div className="h-screen overflow-y-auto relative p-10">
        <div>
          <div className="flex justify-start gap-2 mb-2">
            <SheetEquipment />
            <SelectColumns
              data={table as Table<OfferTableItem>}
              colsListNotHidden={colsListNotHidden}
            />
          </div>
        </div>
        <div className="relative w-full overflow-auto">
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
            <MemoizedTableBody
              table={table}
              columnVisibility={columnVisibility}
              columnSizing={columnSizing}
              dataTable={dataTable}
            />
            {/* <TableBodyOffer table={table} /> */}
            <TableFooterOffer table={table} />
          </div>
          {/* <div className="absolute top-0 left-0 a4 border-dashed border-2 border-white" /> */}
        </div>
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

                <Button
                  size="icon"
                  variant="destructive"
                  className="top-0 -right-10 absolute"
                  onClick={() => removeRow(row.original.id)}
                >
                  <X />
                </Button>
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
