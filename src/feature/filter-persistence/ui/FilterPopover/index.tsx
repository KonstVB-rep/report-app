import React, { useMemo, useState, useTransition } from "react"
import { Filter } from "lucide-react"
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { cn } from "@/shared/lib/utils"

type Props = {
  columnId: string
  options: Record<string, string> | { id: string; label: string }[]
  label: string
}

const FilterPopover = React.memo(({ columnId, options, label }: Props) => {
  const [_, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const { columnFilters, setColumnFilters } = useDataTableFiltersContext()

  // Находим объект фильтра для текущей колонки
  const activeFilter = useMemo(
    () => columnFilters?.find((f) => f.id === columnId),
    [columnFilters, columnId],
  )

  const currentValues = useMemo(() => {
    const val = activeFilter?.value
    if (Array.isArray(val)) return val as string[]
    if (typeof val === "string" && val !== "") return val.split(",")
    return []
  }, [activeFilter])

  const handleChange = (id: string) => {
    if (!setColumnFilters) return

    startTransition(() => {
      setColumnFilters((prev) => {
        const filterObj = prev.find((f) => f.id === columnId)
        const val = filterObj?.value

        let updatedValues: string[] = []
        if (Array.isArray(val)) {
          updatedValues = [...val]
        } else if (typeof val === "string" && val !== "") {
          updatedValues = val.split(",")
        }

        // Toggle ID
        if (updatedValues.includes(id)) {
          updatedValues = updatedValues.filter((v) => v !== id)
        } else {
          updatedValues.push(id)
        }

        // Если значений не осталось — удаляем фильтр из массива совсем
        if (updatedValues.length === 0) {
          return prev.filter((f) => f.id !== columnId)
        }

        // Обновляем существующий или добавляем новый
        const otherFilters = prev.filter((f) => f.id !== columnId)
        return [...otherFilters, { id: columnId, value: updatedValues }]
      })
    })
  }

  const handleClear = () => {
    if (setColumnFilters) {
      startTransition(() => {
        setColumnFilters((prev) => prev.filter((f) => f.id !== columnId))
      })
    }
  }

  const normalizedOptions = useMemo(
    () =>
      Array.isArray(options)
        ? options
        : Object.entries(options).map(([id, label]) => ({ id, label })),
    [options],
  )

  const hasFilter = currentValues.length > 0

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn("relative h-auto", hasFilter ? "border-solid" : "border-dashed")}
          variant="outline"
        >
          <Filter className="h-4 w-4" />
          {label}
          {hasFilter && (
            <span className="absolute right-0 top-0 inline-flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-primary bg-blue-700 text-xs font-medium text-white">
              {currentValues.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-fit px-1 pb-2">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 items-center gap-1">
            {normalizedOptions.map(({ id, label }) => (
              <div className="flex w-fit items-center gap-2 px-1 text-sm p-1" key={id}>
                <Checkbox
                  checked={currentValues.includes(id)}
                  id={`${columnId}-${id}`}
                  onCheckedChange={() => handleChange(id)}
                />
                <Label
                  className="cursor-pointer whitespace-nowrap capitalize"
                  htmlFor={`${columnId}-${id}`}
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
          {hasFilter && (
            <Button className="w-full text-xs h-8" onClick={handleClear} variant="outline">
              Очистить
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
})

FilterPopover.displayName = "FilterPopover"

export default FilterPopover

// Вспомогательная функция cn, если она не импортирован
