import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CalendarComponent from "@/shared/ui/Calendar";

type DatePickerFormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  errorMessage?: string;
  placeholder?: string;
};

export const DatePickerFormField = <T extends FieldValues>({
  name,
  label,
  control,
  errorMessage,
  ...rest
}: DatePickerFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <CalendarComponent field={field} {...rest}/>
          {errorMessage && (
            <FormMessage className="text-red-500">
              {errorMessage as string}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default DatePickerFormField;
