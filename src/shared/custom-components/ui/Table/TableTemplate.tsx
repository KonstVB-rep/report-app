import { Button } from "@/shared/components/ui/button"
import { TableBody, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { HEIGHT_ROW } from "@/shared/lib/constants"
import { cn } from "@/shared/lib/utils"
import { flexRender, type useReactTable } from "@tanstack/react-table"
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react"
import { useMemo } from "react"

type TableTemplateProps<T extends Record<string, unknown>> = {
  table: ReturnType<typeof useReactTable<T>>
  className?: string
  totalSize?: number
  children: React.ReactNode
}

const TableTemplate = <T extends Record<string, unknown>>({
  table,
  className,
  totalSize,
  children,
}: TableTemplateProps<T>) => {
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
    <table
      // className={`w-full grid border-separate border-spacing-0 border border-border ${className}`}
      {...{
        className: `w-full grid border-separate border-spacing-0 border border-border ${className}`,
        style: {
          ...columnSizeVars, //Define column sizes on the <table> element
          width: table.getTotalSize(),
        },
      }}
    >
      <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-800 rounded-se-sm rounded-ss-sm">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            className="flex w-full rounded-se-sm rounded-ss-sm"
            key={headerGroup.id}
            // style={{
            //   contain: "strict",
            // }}
          >
            {headerGroup.headers.map((header, index) => (
              <TableHead
                className={cn(
                  "p-2! flex-1 border-zinc-600 border border-solid relative",
                  index === headerGroup.headers.length - 1 && "rounded-se-sm",
                  index === 0 && "rounded-ss-sm",
                )}
                data-size={header.getSize()}
                key={header.id}
                style={{
                  width: `calc(var(--header-${header?.id}-size) * 1px)`,
                  flex: "0 0 auto",
                  // minWidth: headers?.[index]?.column.columnDef.minSize,
                  // minWidth: header.column.columnDef.minSize,
                  // maxWidth: header.column.columnDef.maxSize,
                }}
              >
                {header.isPlaceholder ? null : (
                  // biome-ignore lint/a11y/noStaticElementInteractions: not button
                  // biome-ignore lint/a11y/useKeyWithClickEvents: not button
                  <div
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none flex items-center justify-center gap-1 h-full text-primary"
                        : "flex items-center justify-center h-full text-primary"
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="text-xs font-semibold first-letter:capitalize text-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {header.column.getCanSort() && (
                      <Button onClick={header.column.getToggleSortingHandler()}>
                        {{
                          asc: <MoveUp className="ml-2 h-4 w-4" />,
                          desc: <MoveDown className="ml-2 h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowDownUp className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    )}
                    {header.column.getCanResize() && (
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${header.column.getIsResizing() ? "isResizing" : ""}`,
                        }}
                      />
                    )}
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody
        style={{
          height: `${totalSize}px`,
          position: "relative",
          minHeight: `${HEIGHT_ROW}px`,
        }}
      >
        {children}
      </TableBody>
    </table>
  )
}

export default TableTemplate
