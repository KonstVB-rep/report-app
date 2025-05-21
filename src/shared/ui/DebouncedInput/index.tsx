import React from "react";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <Label className="relative">
      <Search className="absolute left-2 top-2 h-5 w-5 text-gray-600" />
      <Input
        {...props}
        type="search"
        placeholder="Поиск..."
        className="max-w-48 pl-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Label>
  );
};

export default DebouncedInput;
