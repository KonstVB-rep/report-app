import React from "react";
import { FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import PhoneInput from "../PhoneInput";
import { InputFormProps } from "../type";

const InputPhoneForm = <T extends FieldValues>({
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
      render={({ field }) => {
        const fieldProps = {
          ...field,
          ref: undefined,
          inputRef: field.ref,
        };
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <PhoneInput
                placeholder="Введите телефон пользователя"
                onAccept={field.onChange}
                {...fieldProps}
                {...rest}
                value={field.value as string}
              />
            </FormControl>
            {errorMessage && (
              <FormMessage className="text-red-500">{errorMessage}</FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export default InputPhoneForm;
