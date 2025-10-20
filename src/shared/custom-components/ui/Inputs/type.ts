import type { Control, FieldValues, Path } from "react-hook-form"

export type InputFormProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  control: Control<T>
  errorMessage?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export type TextareaFormProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  control: Control<T>
  errorMessage?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>
