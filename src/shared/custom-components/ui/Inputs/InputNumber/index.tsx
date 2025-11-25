"use client"

import { useEffect, useRef, useState } from "react"
import { formatNumberCurrency } from "@/entities/deal/lib/helpers"
import { Input } from "@/shared/components/ui/input"

interface InputNumberProps {
  placeholder?: string
  value?: string
  onChange: (val: string) => void
  disabled?: boolean
  onBlur?: () => void
}

const InputNumber: React.FC<InputNumberProps> = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  onBlur,
}) => {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const cursorPos = useRef<number | null>(null)

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const cleaned = raw
      .replace(/[^\d,.]/g, "") // только цифры, точка, запятая
      .replace(/\.(?=.*\.)/g, "") // только одна точка
      .replace(/,(?=.*,)/g, "") // только одна запятая
      .replace(".", ",") // точка в запятую

    // сохраняем позицию курсора
    cursorPos.current = e.target.selectionStart

    setInputValue(cleaned)
    onChange(cleaned)
  }

  const handleBlur = () => {
    const formatted = formatNumberCurrency(inputValue)
    setInputValue(formatted)
    onChange(formatted)
    if (onBlur) onBlur()
  }

  // восстанавливаем курсор после рендера
  // biome-ignore lint/correctness/useExhaustiveDependencies: code working good
  useEffect(() => {
    const el = inputRef.current
    if (el && cursorPos.current !== null) {
      el.setSelectionRange(cursorPos.current, cursorPos.current)
    }
  }, [cursorPos.current])

  return (
    <Input
      disabled={disabled}
      inputMode="decimal"
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder={placeholder}
      ref={inputRef}
      type="text"
      value={inputValue}
    />
  )
}

export default InputNumber
