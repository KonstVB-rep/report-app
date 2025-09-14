import React from "react";
import { IMaskInput } from "react-imask";

import { cn } from "@/shared/lib/utils";

interface PhoneInputProps extends React.HTMLAttributes<HTMLInputElement> {
  mask?: string;
  className?: string;
  onAccept?: (value: string) => void;
  value?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

const PhoneInput = ({
  className,
  mask = "+{7}(000)000-00-00 доб. 0000000000",
  value,
  onAccept,
  placeholder,
  required,
  ...props
}: PhoneInputProps) => {
  const handleValueChange = (value: string) => {
    // Проверяем, есть ли добавочный номер
    const cleanValue = value.replace(/\D/g, ""); // Убираем все символы, кроме цифр
    const hasExtension = cleanValue.length > 11; // Если длина больше 11, значит есть добавочный номер

    if (!hasExtension) {
      // Если добавочного номера нет, просто передаем номер без изменений
      onAccept?.(value);
    } else {
      // Если есть добавочный номер, передаем его
      onAccept?.(value);
    }
  };

  return (
    <IMaskInput
      mask={mask}
      placeholder={placeholder}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onAccept={handleValueChange}
      value={value}
      required={required}
      {...props}
    />
  );
};

export default PhoneInput;
