import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { ListChecks } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import type { TableMeta } from "@/shared/hooks/useTableState"

interface SelectColumnsProps<TData extends Record<string, unknown>> {
  data: Table<TData>
}

const SelectColumns = <TData extends Record<string, unknown>>({
  data,
}: SelectColumnsProps<TData>) => {
  const [open, setOpen] = useState(false)
  const hiddenColumns = Object.entries(data.getState().columnVisibility)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, isVisible]) => !isVisible)
    .map(([col]) => col)

  const handleResetVisibility = () => {
    data.setColumnVisibility(Object.fromEntries(data.getAllColumns().map((col) => [col.id, true])))
  }

  const tableMeta = data.options.meta as TableMeta<TData>
  const tanleMetaHiddenCols = Object.entries(tableMeta?.columnVisibility || {}).length

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        asChild
        className={`${
          hiddenColumns.length - 2 > 0 ? "border-solid" : "border-dashed"
        } border-muted-foreground`}
      >
        <Button className="relative flex gap-1" title="Visibility columns" variant="outline">
          <ListChecks />
          {hiddenColumns.length - tanleMetaHiddenCols > 0 && (
            <span className="absolute right-0 top-0 inline-flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-primary bg-blue-700 text-xs font-medium text-white">
              {hiddenColumns.length - tanleMetaHiddenCols}
            </span>
          )}
          {"Колонки показать/скрыть"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-fit px-1 pb-2">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 items-center gap-1">
            {data
              .getAllColumns()
              .filter((col) => {
                return (
                  col.getCanHide() && !(col.columnDef.meta as { hidden: boolean | string })?.hidden
                )
              })
              .map((col) => (
                <div className="flex items-center gap-1" key={col.id}>
                  <Checkbox
                    checked={data.getState().columnVisibility[col.id] ?? true}
                    id={col.id}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  />

                  <label className="cursor-pointer" htmlFor={col.id}>
                    {col.columnDef.header as string}
                  </label>
                </div>
              ))}
          </div>
          {hiddenColumns.length - tanleMetaHiddenCols > 0 && (
            <Button
              className="btn_hover w-full text-xs"
              onClick={handleResetVisibility}
              variant="outline"
            >
              Очистить
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SelectColumns
