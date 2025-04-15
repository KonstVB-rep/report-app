"use client";

import React from "react";
import { FieldValues } from "react-hook-form";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/shared/lib/utils";

type CalendarComponentProps = {
  required?: boolean;
  field: FieldValues;
};

const CalendarComponent = ({
  required = false,
  field,
}: CalendarComponentProps) => {
  const selectedDate = field.value ? new Date(field.value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {selectedDate ? (
              format(selectedDate, "dd.MM.yyyy")
            ) : (
              <span>Выберите дату</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
          required={required}
          // disabled={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
          locale={ru}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalendarComponent;
