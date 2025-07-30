import React from "react";
import { FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { TextareaFormProps } from "../Inputs/type";

const TextareaForm = <T extends FieldValues>({
  name,
  label,
  control,
  errorMessage,
  ...rest
}: TextareaFormProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Введите имя пользователя"
              {...field}
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

export default TextareaForm;
