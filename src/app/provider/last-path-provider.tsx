"use client"

import { createContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const LAST_PATH_KEY = "lastAppPath"

interface LastPathContextProps {
  lastPath: string | null
}

const LastPathContext = createContext<LastPathContextProps>({
  lastPath: null,
})

const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(`[LocalStorage] Failed to read "${key}":`, error)
    return null
  }
}

const safeLocalStorageSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.warn(`[LocalStorage] Failed to write "${key}":`, error)
  }
}

export const LastPathProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const [lastPath, setLastPath] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return safeLocalStorageGet(LAST_PATH_KEY)
  })

  useEffect(() => {
    if (pathname && pathname !== "/" && pathname !== "/login") {
      safeLocalStorageSet(LAST_PATH_KEY, pathname)
      setLastPath(pathname)
    }
  }, [pathname])

  return <LastPathContext.Provider value={{ lastPath }}>{children}</LastPathContext.Provider>
}
