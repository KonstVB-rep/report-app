"use client"

import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { FieldValues } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { FormControl } from "@/shared/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { cn } from "@/shared/lib/utils"

type CalendarComponentProps = {
  required?: boolean
  field: FieldValues
  defaultValue?: string
}

const CalendarComponent = ({ field, defaultValue, ...props }: CalendarComponentProps) => {
  const rawValue = field.value ?? defaultValue
  const selectedDate = rawValue ? new Date(rawValue) : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}
            variant={"outline"}
          >
            {selectedDate ? (
              format(selectedDate, "dd.MM.yyyy", { locale: ru })
            ) : (
              <span>Выберите дату</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          locale={ru}
          mode="single"
          onSelect={(date: Date | undefined) => {
            field.onChange(date || null)
          }}
          required={props.required}
          selected={selectedDate}
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}

export default CalendarComponent
