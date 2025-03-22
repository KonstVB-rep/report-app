import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatterCurrency = new Intl.NumberFormat("ru", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNumber(value: string): string {
  // Удаляем все символы, кроме цифр
  let digitsOnly = value.replace(/\D/g, "");

  // Если строка пустая, возвращаем "0,00"
  if (!digitsOnly) {
    return "0,00";
  }
  // Удаляем ",00" если есть
  digitsOnly = digitsOnly.replace(/,00$/, "");

  // Добавляем разделители разрядов (пробелы) каждые три цифры
  const formattedWithSpaces = digitsOnly.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "\u00A0"
  );
  // Добавляем ",00" в конец
  return formattedWithSpaces + ",00";
}


