"use client"

import { createContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface LastPathContextProps {
  lastPath: string | null
}

export const LastPathContext = createContext<LastPathContextProps>({
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

export const LastPathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const [lastPath, setLastPath] = useState<string | null>(null)

  useEffect(() => {
    const storedPath = safeLocalStorageGet("lastAppPath")
    if (storedPath) {
      setLastPath(storedPath)
    }
  }, [])

  useEffect(() => {
    if (pathname && pathname !== "/" && pathname !== "/login") {
      safeLocalStorageSet("lastAppPath", pathname)
    }
  }, [pathname])

  return <LastPathContext.Provider value={{ lastPath }}>{children}</LastPathContext.Provider>
}
