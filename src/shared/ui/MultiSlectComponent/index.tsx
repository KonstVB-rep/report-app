import React from "react";

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
} from "@/components/ui/multi-select";

type OptionItem = {
  value: string;
  label: string;
};

type MultiSelectComponentProps = {
  defaultValue?: string[];
  options: OptionItem[];
  placeholder: string;
  onValueChange?: (value: string[]) => void;
} & React.ComponentProps<"select">;

const MultiSelectComponent = ({
  defaultValue = [],
  options = [],
  placeholder,
  onValueChange,
  ...props
}: MultiSelectComponentProps) => {
  return (
    // @ts-expect-error: TypeScript does not infer the correct type for MultiSelect props
    <MultiSelect
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      {...props}
    >
      <MultiSelectTrigger className="h-10 border border-solid border-border text-black">
        <MultiSelectValue
          placeholder={placeholder}
          maxDisplay={3}
          maxItemLength={10}
        />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectList>{renderMultiSelectOptions(options)}</MultiSelectList>
      </MultiSelectContent>
    </MultiSelect>
  );
};

export default MultiSelectComponent;
