import React from "react";
import { DateRange } from "react-day-picker";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface DateRangeFilterProps {
  onDateChange: (date: DateRange | undefined) => void;
  onClearDateFilter: (columnId: string) => void;
  value?: DateRange;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateChange,
  onClearDateFilter,
  value,
}) => {
  // Используем сразу переданное `value`, без `useState`
  const handleDateChange = (date: DateRange | undefined) => {
    if (date?.from && typeof date.from === "string") {
      date.from = new Date(date.from);
    }
    if (date?.to && typeof date.to === "string") {
      date.to = new Date(date.to);
    }

    onDateChange(date);
  };

  const handleClear = () => {
    onDateChange(undefined);
    onClearDateFilter("dateRequest");
  };

  return (
    <div
      className={`relative flex max-w-fit items-center gap-4 rounded border ${
        value ? "border-solid" : "border-dashed"
      } border-muted-foreground`}
    >
      <DateRangePicker value={value} onValueChange={handleDateChange} />
      {value && (
        <Button
          variant={"outline"}
          onClick={handleClear}
          className="absolute right-0 h-full p-2"
        >
          <X />
        </Button>
      )}
    </div>
  );
};

export default DateRangeFilter;
