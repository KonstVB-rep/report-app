"use client"

import { type MouseEvent, useState } from "react"
import { X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/shared/components/ui/button"
import { DateRangePicker } from "@/shared/components/ui/date-range-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { getPeriodRange } from "../utils"
import PeriodButtonsGroup from "./PeriosButtonsGroup"

type DateRangeParams = "week" | "month" | "year"

interface DateFiltersProps {
  dateRangeState: DateRangeParams | null
  selectedDate: DateRange | undefined
  onChange: (range: DateRange | undefined, id?: DateRangeParams) => void
}

export default function DateFilters({ dateRangeState, selectedDate, onChange }: DateFiltersProps) {
  const [open, setOpen] = useState(false)

  const handleClick = (e: MouseEvent<HTMLButtonElement>, id: DateRangeParams) => {
    e.preventDefault()
    onChange(getPeriodRange(id), id)
  }

  return (
    <div className="flex gap-2 justify-between items-center flex-wrap">
      {/* Кнопки периода для десктопа */}

      <PeriodButtonsGroup
        activeRange={dateRangeState}
        className="hidden gap-2 flex-wrap sm:flex"
        handleClick={handleClick}
      />

      {/* Поповер для мобильной версии */}
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button className="block sm:hidden" variant="outline">
            Период
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-2">
          <PeriodButtonsGroup
            activeRange={dateRangeState}
            className="grid gap-2 flex-wrap"
            handleClick={handleClick}
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2 flex-wrap w-full xs:w-auto">
        <DateRangePicker label="Дата" onValueChange={(val) => onChange(val)} value={selectedDate} />
        {selectedDate && (
          <Button
            aria-label="Сбросить дату"
            className="flex-1"
            onClick={() => onChange(undefined)}
            variant="outline"
          >
            <X className="hidden xs:block" />
            <span className="p-2 flex items-center justify-center xs:hidden">Сбросить даты</span>
          </Button>
        )}
      </div>
    </div>
  )
}
