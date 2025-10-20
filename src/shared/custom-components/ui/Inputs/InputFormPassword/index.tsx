import type { FieldValues } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import InputPassword from "../InputPassword"
import type { InputFormProps } from "../type"

const InputFormPassword = <T extends FieldValues>({
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
            <InputPassword
              placeholder="Введите пароль"
              {...field}
              maxLength={30}
              minLength={6}
              {...rest}
            />
          </FormControl>
          {errorMessage && <FormMessage className="text-red-500">{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  )
}

export default InputFormPassword
