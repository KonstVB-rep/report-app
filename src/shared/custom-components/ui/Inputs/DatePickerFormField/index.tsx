import type { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import CalendarComponent from "@/shared/custom-components/ui/Calendar";

type DatePickerFormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
};

export const DatePickerFormField = <T extends FieldValues>({
  name,
  label,
  control,
  errorMessage,
  ...rest
}: DatePickerFormFieldProps<T>) => {
  const { className, ...props } = rest;
  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {rest.required && <span className="pl-1 text-red-700">*</span>}
          </FormLabel>
          <CalendarComponent field={field} {...props} />
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
