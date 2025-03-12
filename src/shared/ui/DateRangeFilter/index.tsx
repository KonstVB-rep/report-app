import React, { useState, useEffect } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    setDate(value);
  }, [value]);

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
    onDateChange(date);
  };

  const handleClear = () => {
    onDateChange(undefined);
    setDate(undefined);
    onClearDateFilter("dateRequest");
  };

  return (
    <div className={`flex items-center gap-4 relative max-w-fit border rounded ${
      date ? "border-solid" : "border-dashed"
    } border-muted-foreground`}>
      <DateRangePicker value={date} onValueChange={handleDateChange} />
      {date && (
        <Button
          variant={"outline"}
          onClick={handleClear}
          className="absolute right-0 p-2 h-full"
        >
          <X />
        </Button>
      )}
    </div>
  );
};

export default DateRangeFilter;
