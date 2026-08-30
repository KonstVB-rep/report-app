"use client"

import { useMemo } from "react"
import { useTheme } from "next-themes"
import useStoreUser from "@/entities/user/store/useStoreUser"
import Starfield from "@/shared/custom-components/ui/StarField"

type TypeOptionsTheme = {
  starCount: number
  starColor: [number, number, number]
  backgroundColor: string
}

const darkThemeOptions: TypeOptionsTheme = {
  starCount: 1000,
  starColor: [255, 255, 255],
  backgroundColor: "black",
}

const lightThemeOptions: TypeOptionsTheme = {
  starCount: 3000,
  starColor: [21, 52, 251],
  backgroundColor: "snow",
}

const getThemeOptions = (
  theme: string | undefined,
  systemTheme: string | undefined,
): TypeOptionsTheme => {
  if (theme === "system") {
    return systemTheme === "light" ? lightThemeOptions : darkThemeOptions
  }
  return theme === "light" ? lightThemeOptions : darkThemeOptions
}

const DashboardClient = () => {
  const { authUser } = useStoreUser()
  const { theme, systemTheme } = useTheme()

  const currentThemeOptions = useMemo(
    () => getThemeOptions(theme, systemTheme),
    [theme, systemTheme],
  )

  const userFirstName = useMemo(() => {
    if (!authUser?.username) return ""
    const parts = authUser.username.split(" ")
    return parts[1] || parts[0] || ""
  }, [authUser?.username])

  return (
    <div
      className="min-h-[calc(100svh-var(--header-height)-2px)] w-full grid place-items-center relative overflow-hidden"
      suppressHydrationWarning
    >
      <Starfield
        backgroundColor={currentThemeOptions.backgroundColor}
        speedFactor={0.005}
        starColor={currentThemeOptions.starColor}
        starCount={currentThemeOptions.starCount}
      />
      <div className="grid gap-5 relative z-10">
        <h1 className="text-2xl text-center">
          Добро пожаловать{userFirstName && `, ${userFirstName}`}!
        </h1>
        <p className="text-lg text-center">Вы можете начать свою работу с боковой панели.</p>
      </div>
    </div>
  )
}

export default DashboardClient
