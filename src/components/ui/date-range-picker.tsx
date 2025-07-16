"use client";

import * as React from "react";
import { useEffect } from "react";
import { DateRange } from "react-day-picker";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/shared/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  value?: DateRange;
  onValueChange?: (value: DateRange | undefined) => void;
};

export function DateRangePicker({ className, value, onValueChange }: Props) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  const stableValue = React.useMemo(
    () => ({ from: value?.from, to: value?.to }),
    [value?.from, value?.to]
  );

  useEffect(() => {
    setDate(stableValue);
  }, [stableValue]);

  const handleSelect = (date: DateRange | undefined) => {
    setDate(date);
    onValueChange?.(date);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-max sm:w-fit justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  <span className="first-letter:capitalize">
                    {format(date.from, "LLL dd, y", { locale: ru })}
                  </span>{" "}
                  -{" "}
                  <span className="first-letter:capitalize">
                    {format(date.to, "LLL dd, y", { locale: ru })}
                  </span>
                </>
              ) : (
                <span className="first-letter:capitalize">
                  {format(date.from, "LLL dd, y", { locale: ru })}
                </span>
              )
            ) : (
              <span>Выберите диапазон дат</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
