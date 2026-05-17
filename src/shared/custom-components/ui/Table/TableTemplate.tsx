import { flexRender, type useReactTable } from "@tanstack/react-table"
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { TableBody, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { HEIGHT_ROW, NOT_GROW_COLS } from "@/shared/lib/constants"
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
      <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-800 rounded-t-sm">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow className="flex w-full" key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => {
              return (
                <TableHead
                  className={cn("p-2! border-zinc-600 border border-solid relative h-auto", {
                    "rounded-tr-sm": index === headerGroup.headers.length - 1,
                    "rounded-tl-sm": index === 0,
                  })}
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    flex: NOT_GROW_COLS.includes(header.id) ? "0 0 auto" : "1 0 auto",
                  }}
                >
                  {!header.isPlaceholder && (
                    <div className="grid content-center justify-items-center h-full text-primary px-1">
                      <span className="text-xs font-semibold first-letter:capitalize text-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getCanSort() && (
                        <Button
                          className="flex justify-center"
                          onClick={header.column.getToggleSortingHandler()}
                          size="icon"
                          variant="ghost"
                        >
                          {{
                            asc: <MoveUp className="ml-2 h-4 w-4" />,
                            desc: <MoveDown className="ml-2 h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ArrowDownUp className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </TableHead>
              )
            })}
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
