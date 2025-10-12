import React, { useEffect, useRef } from "react"
import { Input } from "@/shared/components/ui/input"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
} from "@/shared/components/ui/multi-select"

type OptionItem = {
  value: string
  label: string
}

type MultiSelectComponentProps = {
  defaultValue?: string[]
  options: OptionItem[]
  placeholder: string
  onValueChange?: (value: string[]) => void
} & React.ComponentProps<"select">

const MultiSelectComponent = ({
  defaultValue = [],
  options = [],
  placeholder,
  onValueChange,
  ...props
}: MultiSelectComponentProps) => {
  return (
    // @ts-expect-error: TypeScript does not infer the correct type for MultiSelect props
    <MultiSelect defaultValue={defaultValue} onValueChange={onValueChange} {...props}>
      <MultiSelectTrigger className="h-10 border border-solid border-border text-black">
        <MultiSelectValue maxDisplay={3} maxItemLength={10} placeholder={placeholder} />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectList>{renderMultiSelectOptions(options)}</MultiSelectList>
      </MultiSelectContent>
    </MultiSelect>
  )
}

export default MultiSelectComponent

type MultiSelectNativeFormProps = {
  defaultValue?: string[]
  options: OptionItem[]
  placeholder: string
  name: string
  onValueChange?: (value: string[]) => void
  id: string
  disabled?: boolean
}

export const MultiSelectNativeForm = ({
  defaultValue = [],
  options = [],
  placeholder,
  onValueChange,
  name,
  id,
  disabled,
  ...props
}: MultiSelectNativeFormProps) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  const [selectedValues, setSelectedValues] = React.useState<string[]>(() =>
    defaultValue.map((s) => s.trim()),
  )

  useEffect(() => {
    if (defaultValue && defaultValue.length > 0) {
      setSelectedValues(defaultValue.map((s) => s.trim()))
    }
  }, [defaultValue])

  const handleValueChange = (values: string[]) => {
    setSelectedValues(values)
    onValueChange?.(values)

    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(values)
    }
  }

  return (
    <>
      <Input
        id={id}
        name={name}
        ref={hiddenInputRef}
        type="hidden"
        value={JSON.stringify(selectedValues)}
      />

      <MultiSelect
        disabled={disabled}
        onValueChange={handleValueChange}
        value={selectedValues}
        {...props}
      >
        <MultiSelectTrigger className="h-10 border border-solid border-border text-black">
          <MultiSelectValue maxDisplay={3} maxItemLength={10} placeholder={placeholder} />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectList>{renderMultiSelectOptions(options)}</MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </>
  )
}
