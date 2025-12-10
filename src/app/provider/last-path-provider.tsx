"use client"

import { createContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface LastPathContextProps {
  lastPath: string | null
}

export const LastPathContext = createContext<LastPathContextProps>({
  lastPath: null,
})

export const LastPathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()

  const [lastPath, setLastPath] = useState<string | null>(null)

  useEffect(() => {
    const storedPath = localStorage.getItem("lastAppPath")
    if (storedPath) {
      setLastPath(storedPath)
    }
  }, [])

  useEffect(() => {
    if (pathname && pathname !== "/" && pathname !== "/login") {
      localStorage.setItem("lastAppPath", pathname)
    }
  }, [pathname])

  return <LastPathContext.Provider value={{ lastPath }}>{children}</LastPathContext.Provider>
}
