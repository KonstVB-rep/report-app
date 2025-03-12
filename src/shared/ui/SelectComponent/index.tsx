import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectComponentProps = {
  placeholder: string;
  options: [string, string][]; // Это массив кортежей [key, value]
  classname?: string;
} & React.ComponentProps<typeof Select>;

const SelectComponent = ({
  placeholder,
  options,
  classname,
  value,
  onValueChange,
  ...props
}: SelectComponentProps) => {


  return (
    <Select value={value} onValueChange={(val) => onValueChange?.(val)} {...props} >
      <SelectTrigger className={`w-full ${classname}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
