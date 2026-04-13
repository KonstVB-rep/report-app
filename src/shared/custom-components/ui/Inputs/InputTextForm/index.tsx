import type { FieldValues } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import type { InputFormProps } from "../type"

const InputTextForm = <T extends FieldValues>({
  name,
  label,
  control,
  errorMessage,
  showStarRequired = false,
  ...rest
}: InputFormProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {showStarRequired && <span className="pl-1 text-red-700">*</span>}
          </FormLabel>
          <FormControl>
            <Input placeholder="Введите имя пользователя" {...field} {...rest} />
          </FormControl>
          {errorMessage && <FormMessage className="text-red-500">{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  )
}

export default InputTextForm
