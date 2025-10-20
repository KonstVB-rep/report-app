import type React from "react"
import { X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/shared/components/ui/button"
import { DateRangePicker } from "@/shared/components/ui/date-range-picker"

import "./datePickerStyles.css"

interface DateRangeFilterProps {
  onDateChange: (date: DateRange | undefined) => void
  onClearDateFilter: (columnId: string) => void
  value?: DateRange
  columnId?: string
  label: string
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateChange,
  onClearDateFilter,
  value,
  columnId = "dateRequest",
  label,
}) => {
  const handleClear = () => {
    onDateChange(undefined)
    onClearDateFilter(columnId)
  }

  return (
    <div
      className={`relative flex items-center gap-4 rounded-md border ${
        value ? "border-solid min-w-[280px]" : "border-dashed max-w-fit"
      } border-muted-foreground`}
    >
      <DateRangePicker label={label} onValueChange={onDateChange} value={value} />
      {value && (
        <Button
          className="absolute right-0 h-full p-2 rounded"
          onClick={handleClear}
          variant="outline"
        >
          <X />
        </Button>
      )}
    </div>
  )
}

export default DateRangeFilter
