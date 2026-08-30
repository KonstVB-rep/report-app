import { flexRender, type Table as ReactTable } from "@tanstack/react-table"
import { useSidebar } from "@/shared/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import useScrollIntoViewBottom from "@/shared/hooks/useScrollIntoViewBottomTable"
import type { EventInputType } from "../types"

type EventsListTableProps<T extends EventInputType> = {
  table: ReactTable<T>
  handleRowClick?: (row: T) => void
}

const EventsListTable = <T extends EventInputType>({
  table,
  handleRowClick,
}: EventsListTableProps<T>) => {
  const ref = useScrollIntoViewBottom<HTMLTableElement>()

  const { isMobile } = useSidebar()

  const handleClickRowEvent = (row: T) => {
    if (!row.end) {
      handleRowClick?.(row)
      return
    }

    try {
      const endDate = new Date(row.end)
      const now = new Date()
      if (endDate < now) return
      handleRowClick?.(row)
    } catch (error) {
      console.error("Неверный формат даты:", row.end)
      console.log(error, "EventsListTable")
    }
  }

  const rows = table?.getRowModel()?.rows || []
  const hasRows = rows.length > 0
  const allColumns = table.getAllColumns()

  if (!hasRows && !table?.getRowModel()?.rows) {
    return <div className="w-full p-4 text-center">Загрузка данных...</div>
  }

  return (
    <Table className="w-full border-separate border-spacing-0 border" ref={ref}>
      <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-800">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                className={`border-r border-zinc-600 px-3 py-2 dark:bg-zinc-800 ${header.column.id === "title" ? "" : "whitespace-nowrap"}`}
                colSpan={header.colSpan}
                key={header.id}
              >
                {header.isPlaceholder ? null : (
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none flex items-center text-center justify-center w-full gap-1 h-full text-primary"
                        : "flex items-center justify-center h-full w-full text-center text-primary",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    <span className="text-center text-xs font-semibold first-letter:capitalize">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody className="table-grid-container space-y-[2px]">
        {hasRows ? (
          rows.map((row) => {
            const eventData = row.original
            const isPastEvent = eventData.end ? new Date(eventData.end) < new Date() : false

            return (
              <TableRow
                className={`tr hover:bg-zinc-600 hover:text-white ${
                  isPastEvent ? "opacity-50" : ""
                }`}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => {
                  const isTitleColumn = cell.column.id === "title"

                  return (
                    <TableCell
                      className={`td w-fit border-b border-r ${
                        isTitleColumn ? "" : "whitespace-nowrap"
                      }`}
                      key={cell.id}
                      onClick={isMobile ? () => handleClickRowEvent(cell.row.original) : undefined}
                      onDoubleClick={
                        !isMobile ? () => handleClickRowEvent(cell.row.original) : undefined
                      }
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })
        ) : (
          <TableRow className="h-[50px]">
            <TableCell className="py-4" colSpan={allColumns.length}>
              <div className="text-center whitespace-nowrap font-semibold">Нет данных</div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default EventsListTable
