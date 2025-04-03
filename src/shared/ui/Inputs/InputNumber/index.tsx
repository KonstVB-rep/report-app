import { cn } from "@/shared/lib/utils";
import React, { forwardRef, ForwardedRef } from "react";
import { IMaskInput } from "react-imask";

interface InputNumberProps
  extends Omit<
    React.HTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "ref"
  > {
  className?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      placeholder,
      value,
      onChange,
      disabled = false,
      ...props
    }: InputNumberProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {

    
    return (
      <IMaskInput
        {...props}
        inputRef={ref} // Передаем ref базовому DOM-элементу через inputRef
        mask={Number}
        min={0}
        max={999999999999.99}
        scale={2}
        padFractionalZeros={true}
        thousandsSeparator={"\u00A0"}
        radix=","
        normalizeZeros={true}
        onAccept={(value) => {
          onChange?.(value)}
        }
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
      />
    );
  }
);


InputNumber.displayName = "InputNumber";
export default InputNumber;