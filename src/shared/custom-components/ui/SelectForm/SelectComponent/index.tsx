import type * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

type SelectComponentProps = {
  placeholder: string
  options: [string, string][] // Это массив кортежей [key, value]
  className?: string
} & React.ComponentProps<typeof Select>

const SelectComponent = ({
  placeholder,
  options,
  value,
  onValueChange,
  className,
  ...props
}: SelectComponentProps) => {
  return (
    <Select key={value} onValueChange={(val) => onValueChange?.(val)} value={value} {...props}>
      <SelectTrigger className="w-full border border-solid">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {options?.map(([key, value]) => (
            <SelectItem className={`${className}`} key={key} value={key}>
              <span className={`${className}`}>{value}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectComponent
