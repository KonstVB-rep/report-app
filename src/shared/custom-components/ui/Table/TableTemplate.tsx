import { flexRender, type useReactTable } from "@tanstack/react-table"
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react"
import { TableBody, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { HEIGHT_ROW } from "@/shared/lib/constants"
import { cn } from "@/shared/lib/utils"

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
  return (
    <table
      className={`w-full grid border-separate border-spacing-0 border border-border ${className}`}
    >
      <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-800 rounded-se-sm rounded-ss-sm">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow className="flex w-full rounded-se-sm rounded-ss-sm" key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => (
              <TableHead
                className={cn(
                  "p-2! flex-1 border-zinc-600 border-1 border-solid",
                  index === headerGroup.headers.length - 1 && "rounded-se-sm",
                  index === 0 && "rounded-ss-sm",
                )}
                data-size={header.getSize()}
                key={header.id}
                style={{
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize,
                  maxWidth: header.column.columnDef.maxSize,
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
                    <span className="text-xs font-semibold first-letter:capitalize">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {header.column.getCanSort() && (
                      <span>
                        {{
                          asc: <MoveUp className="ml-2 h-4 w-4" />,
                          desc: <MoveDown className="ml-2 h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowDownUp className="ml-2 h-4 w-4" />
                        )}
                      </span>
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
