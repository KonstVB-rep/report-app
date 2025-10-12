import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/shared/components/ui/input"

interface InputNumberProps {
  placeholder?: string
  value?: string
  onChange: (val: string) => void
  disabled?: boolean
  onBlur?: () => void
}

const formatOnBlur = (raw: string): string => {
  if (!raw) return ""

  const cleaned = raw.replace(/\s/g, "").replace(",", ".")
  const num = parseFloat(cleaned)

  if (Number.isNaN(num)) return ""

  const [integer, fractional = ""] = num.toFixed(2).split(".")
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${formattedInteger},${fractional}`
}

const InputNumber: React.FC<InputNumberProps> = ({
  placeholder,
  value,
  onChange,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (value) {
      const formatted = formatOnBlur(value)
      setInputValue(formatted)
    }
  }, [value])

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value

    // Разрешаем только цифры, запятую и точку
    const cleaned = raw
      .replace(/[^\d,.]/g, "")
      .replace(/\.(?=.*\.)/g, "") // только одна точка
      .replace(/,(?=.*,)/g, "") // только одна запятая

    // Преобразуем точку в запятую
    const normalized = cleaned.replace(".", ",")

    setInputValue(normalized)
    onChange(normalized)
  }

  const handleBlur = () => {
    const formatted = formatOnBlur(inputValue)
    setInputValue(formatted)
    onChange(formatted)
  }

  return (
    <Input
      disabled={disabled}
      inputMode="decimal"
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder={placeholder}
      type="text"
      value={inputValue}
    />
  )
}

export default InputNumber
