import React from "react";
import { FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputNumber from "@/shared/ui/Inputs/InputNumber";

import { InputFormProps } from "../type";

const InputNumberForm = <T extends FieldValues>({
  name,
  label,
  control,
  errorMessage,
  ...rest
}: InputFormProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputNumber
              value={
                typeof field.value === "string"
                  ? field.value
                  : String(field.value ?? "")
              }
              onChange={(val) => field.onChange(val)} // оборачиваем!
              onBlur={field.onBlur}
              placeholder={rest.placeholder}
              disabled={rest.disabled}
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

export default InputNumberForm;
