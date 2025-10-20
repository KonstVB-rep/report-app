import React, { useState, useTransition } from "react"
import { Filter } from "lucide-react"
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"

type Props = {
  columnId: string
  options: Record<string, string> | { id: string; label: string }[]
  label: string
}

const FilterPopover = React.memo(({ columnId, options, label }: Props) => {
  const [, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const { columnFilters, setColumnFilters } = useDataTableFiltersContext()

  const existingFilter = columnFilters?.find((f) => f.id === columnId)
  const selectedValue = existingFilter?.value as string | undefined

  const normalizedOptions = Array.isArray(options)
    ? options
    : Object.entries(options).map(([id, label]) => ({ id, label }))

  const handleChange = (value: string) => {
    if (!setColumnFilters) return

    startTransition(() => {
      setColumnFilters((prev) => {
        if (selectedValue === value) {
          return prev
        }
        const oldFilters = prev.filter((f) => f.id !== columnId)
        return [...oldFilters, { id: columnId, value }]
      })
    })
  }

  const handleClear = () => {
    if (setColumnFilters) {
      startTransition(() => {
        setColumnFilters((prev) => prev.filter((f) => f.id !== columnId))
      })
    }
    setOpen(false)
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={`relative h-auto ${
            selectedValue ? "border-solid" : "border-dashed"
          } border-muted-foreground`}
          variant="outline"
        >
          <Filter className="h-4 w-4" />
          {label}
          {selectedValue && (
            <span className="absolute right-0 top-0 inline-flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-primary bg-blue-700 text-xs font-medium text-white">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2">
        <RadioGroup className="space-y-2" onValueChange={handleChange} value={selectedValue || ""}>
          {normalizedOptions.map(({ id, label }) => (
            <div className="flex items-center space-x-1" key={id}>
              <RadioGroupItem id={id} value={id} />
              <Label className="cursor-pointer capitalize" htmlFor={id}>
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {selectedValue && (
          <Button className="mt-3 w-full text-xs" onClick={handleClear} variant="outline">
            Очистить
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
})

FilterPopover.displayName = "FilterPopover"

export default FilterPopover
