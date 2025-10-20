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

const InputTimeForm = <T extends FieldValues>({
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
            <Input type="time" {...field} {...rest} />
          </FormControl>
          {errorMessage && <FormMessage className="text-red-500">{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  )
}
export default InputTimeForm
