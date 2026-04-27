import { cn, formatterCurrency } from "@/shared/lib/utils"
import RowNumber from "@/widgets/deal/model/columnsDataColsTemplate/RowNumber"
import { CellContext, ColumnDef, flexRender, Table } from "@tanstack/react-table"
import { DataPart, updatePartTitle } from "../store"
import InputTitle from "./InputTitle"
import OfferSubSection from "./OfferSubSection"
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

const OfferSection = ({
  table,
  columnSizeVars,
  dataPart,
  partId,
}: {
  table: Table<OfferTableItem>
  columnSizeVars: { [key: string]: number }
  dataPart: DataPart
  partId: string
}) => {
  // const dataTable = useOfferStoreTable((state) => state.dataParts);

  // const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
  //   id: false,
  //   rowNumber: false,
  // });

  // const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() =>
  //   getLS(`${storageKey}_columnSizing`, {}),
  // );

  // const [_columnSizingInfo, setColumnSizingInfo] =
  //   useState<ColumnSizingInfoState>({} as ColumnSizingInfoState);

  // useEffect(() => {
  //   setLS(`${storageKey}_columnSizing`, columnSizing);
  // }, [columnSizing, storageKey]);

  // const columns = useMemo(() => defaultColumns, []);

  // const table = useReactTable({
  //   data: [],
  //   columns,
  //   state: {
  //     columnVisibility,
  //     columnSizing,
  //   },
  //   onColumnVisibilityChange: setColumnVisibility,
  //   onColumnSizingChange: setColumnSizing,
  //   onColumnSizingInfoChange: setColumnSizingInfo,
  //   getCoreRowModel: getCoreRowModel(),
  //   defaultColumn: {
  //     minSize: 60,
  //     maxSize: 800,
  //   },
  //   columnResizeMode: "onChange",
  // });

  // const columnSizeVars = useMemo(() => {
  //   const headers = table.getFlatHeaders();
  //   const colSizes: { [key: string]: number } = {};
  //   for (let i = 0; i < headers.length; i++) {
  //     const header = headers[i]!;
  //     colSizes[`--header-${header.id}-size`] = header.getSize();
  //     colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
  //   }
  //   return colSizes;
  // }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <div className="h-screen overflow-y-auto relative p-10">
      <div></div>

      <div className="relative w-full overflow-auto">
        <div className="flex gap-2 justify-start items-center border-t-[4px] border-t-blue-900 border-b-[2px] border-b-black">
          <p className="text-xl font-bold">Раздел</p>
          <InputTitle
            defaultTitle={dataPart?.name || ""}
            updateTitleAction={(title) => updatePartTitle(partId, title)}
            className="text-xl! h-10!"
          />
        </div>
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
          {dataPart?.sections.map((section) => (
            <OfferSubSection
              key={section.id}
              table={table}
              data={section.subSections}
              partId={partId}
              sectionId={section.id}
            />
          ))}
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
    </div>
  )
}

export default OfferSection
