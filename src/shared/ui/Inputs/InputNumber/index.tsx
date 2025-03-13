import { cn } from "@/shared/lib/utils";
import React, { type ForwardedRef } from "react";
import { IMaskInput } from "react-imask";

interface InputNumberProps
  extends Omit<
    React.HTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "ref"
  > {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  ref?: ForwardedRef<typeof IMaskInput>;
}

const InputNumber = ({
  className,
  placeholder,
  value,
  onChange,
  ref,
  ...props
}: InputNumberProps) => {
  return (
    <IMaskInput
      {...props}
      ref={ref}
      mask={Number}
      min={0}
      max={999999999999.99}
      scale={2}
      padFractionalZeros={true}
      thousandsSeparator={"\u00A0"}
      radix=","
      normalizeZeros={true}
      onAccept={(value) => onChange?.(value)}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      placeholder={placeholder}
      value={value}
    />
  );
};

InputNumber.displayName = "InputNumber";
export default InputNumber;
