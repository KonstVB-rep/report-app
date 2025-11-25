import type { CheckedState } from "@radix-ui/react-checkbox"
import type { Row, Table } from "@tanstack/react-table"
import { ClipboardCheck } from "lucide-react"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { cn } from "@/shared/lib/utils"

export const SelectColHeader = <T,>() => ({
  label: (table: Table<T>) => (
    <Label className={cn("flex items-center justify-center cursor-pointer")}>
      {table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected() ? (
        <ClipboardCheck />
      ) : (
        "Выбрать"
      )}
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        className="opacity-0 w-0 h-0"
        onCheckedChange={(value: CheckedState) => table.toggleAllPageRowsSelected(!!value)}
      />
    </Label>
  ),
  cell: (row: Row<T>) => (
    <div className="flex items-center justify-center gap-1">
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value: CheckedState) => row.toggleSelected(!!value)}
      />
    </div>
  ),
})

export const SelectColDataColumn = <T,>() => ({
  id: "select",
  header: ({ table }: { table: Table<T> }) => SelectColHeader<T>().label(table),
  cell: ({ row }: { row: Row<T> }) => SelectColHeader<T>().cell(row),
  enableHiding: false,
  enableSorting: false,
  meta: {
    isNotSearchable: true,
  },
  minSize: 80,
  maxSize: 80,
})
