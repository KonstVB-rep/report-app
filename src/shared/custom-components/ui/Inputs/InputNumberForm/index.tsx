import type { FieldValues } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import InputNumber from "@/shared/custom-components/ui/Inputs/InputNumber"
import type { InputFormProps } from "../type"

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
              disabled={rest.disabled}
              onBlur={field.onBlur}
              onChange={(val) => field.onChange(val)}
              placeholder={rest.placeholder}
              value={typeof field.value === "string" ? field.value : String(field.value ?? "")}
            />
          </FormControl>
          {errorMessage && <FormMessage className="text-red-500">{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  )
}

export default InputNumberForm
