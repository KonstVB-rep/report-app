import { Input } from "@/components/ui/input";
import React from "react";

interface InputNumberProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const InputNumber: React.FC<InputNumberProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
 
  const cleanedValue = value?.replace(/\s+/g, "").replace(",", ".") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\s+/g, "").replace(",", ".");

    if (isNaN(parseFloat(numericValue))) return;


    onChange?.(numericValue);
  };

  return (
    <Input
      type="text"
      value={cleanedValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default InputNumber;