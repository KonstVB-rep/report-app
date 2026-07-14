// src/shared/lib/hooks/use-media-query.ts
"use client"

import { useSyncExternalStore } from "react"

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    // 1. ПОДПИСКА (subscribe): Вешаем слушатель изменения брейкпоинта
    (callback) => {
      if (typeof window === "undefined") return () => {}

      const media = window.matchMedia(query)
      media.addEventListener("change", callback)

      // Снимаем слушатель при размонтировании
      return () => media.removeEventListener("change", callback)
    },

    // 2. СЛЕПОК НА КЛИЕНТЕ (getSnapshot): Считываем текущее состояние экрана
    () => {
      if (typeof window === "undefined") return false
      return window.matchMedia(query).matches
    },

    // 3. СЛЕПОК НА СЕРВЕРЕ (getServerSnapshot): Безопасный фоллбэк для SSR Next.js
    () => false, // На сервере экрана нет, всегда отдаем false, исключая Hydration Mismatch!
  )
}
