import { useCallback, useRef } from "react"

// A — это массив аргументов. Он расширяет unknown[], что безопасно.
export const useDebounceCallback = <A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number,
) => {
  // Используем ReturnType для кросс-платформенности (браузер/node)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (...args: A) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  )
}
