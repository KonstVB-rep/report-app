import { useCallback, useRef } from "react"

/**
 * Дебонсит вызов функции с точной типизацией
 * @param callback — функция, которую нужно дебаунсить
 * @param delay — задержка в мс
 * @returns дебаунснутая версия callback
 */

export const useDebounceCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
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
