import React, { useCallback, useEffect, useState } from "react";

import { Search } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type DebouncedInputProps = {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

const DebouncedInput: React.FC<DebouncedInputProps> = React.memo(
  ({ value: initialValue, onChange, debounce = 300, ...props }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);

      return () => clearTimeout(timeout);
    }, [value, debounce, onChange]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      },
      []
    );

    return (
      <Label className="relative">
        <Search className="absolute left-2 top-2 h-5 w-5 text-gray-600" />
        <Input
          {...props}
          type="search"
          className="max-w-48 pl-8"
          value={value}
          onChange={handleChange}
        />
      </Label>
    );
  }
);

DebouncedInput.displayName = "DebouncedInput";

export default DebouncedInput;
