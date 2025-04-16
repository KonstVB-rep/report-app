import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import SelectComponent from "../SelectComponent";

type SelectFormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  errorMessage?: string;
  onValueChange?: (value: string) => void | undefined;
} & React.ComponentProps<typeof SelectComponent>;

const SelectFormField = <T extends FieldValues>({
  name,
  label,
  control,
  onValueChange,
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
              value={field.value || ""}
              onValueChange={onValueChange || field.onChange}
              {...rest}
            />
          </FormControl>

          {errorMessage && (
            <FormMessage className="text-red-500">{errorMessage}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default SelectFormField;
