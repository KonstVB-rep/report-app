import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import SelectComponent from "../SelectComponent";
import { Control, FieldValues, Path } from "react-hook-form";

type SelectFormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  errorMessage?: string;
  // option: [[label: string, value: string]];
} & React.ComponentProps<typeof SelectComponent>;

const SelectFormField = <T extends FieldValues>({
  name,
  label,
  control,
  // option,
  errorMessage,
  ...rest
}: SelectFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <SelectComponent
              className="valid:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
              value={field.value}
              onValueChange={field.onChange}
              { ...rest}
              // options={option}
            />
          </FormControl>
          {errorMessage && (
            <FormMessage className="text-red-500">
              {errorMessage}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default SelectFormField;
