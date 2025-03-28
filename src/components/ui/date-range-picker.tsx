"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ru } from "date-fns/locale";
import { cn } from "@/shared/lib/utils";
import { useEffect } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  value?: DateRange;
  onValueChange: (value: DateRange | undefined) => void;
};

export function DateRangePicker({ className, value, onValueChange }: Props) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  useEffect(() => {
    setDate(value);
  }, [value?.from, value?.to]);

  const handleSelect = (date: DateRange | undefined) => {
    setDate(date);
    onValueChange(date);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
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
              <span>Выберите диапазон дат заявок</span>
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
