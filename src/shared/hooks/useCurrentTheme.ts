import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

const useCurrentTheme = () => {
  const { theme } = useTheme()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    setIsDark(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const isDarkMode = theme === "dark" || (theme === "system" && isDark)

  return isDarkMode
}

export default useCurrentTheme
