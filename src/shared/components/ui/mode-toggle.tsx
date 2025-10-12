"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { cn } from "@/shared/lib/utils"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full md:w-12 md:h-12" title="Выбрать тему" variant="outline">
          <Sun className="hidden h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 md:flex" />
          <Moon className="hidden absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 md:flex" />
          <span className="sr-only">Переключить тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="grid gap-1">
        <DropdownMenuItem
          className={cn("cursor-pointer", theme === "light" ? "btn_blue" : "btn_hover")}
          onClick={() => setTheme("light")}
        >
          <span className={cn(theme === "light")}>Светлая</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn("cursor-pointer", theme === "dark" ? "btn_blue" : "btn_hover")}
          onClick={() => setTheme("dark")}
        >
          <span className={cn(theme === "dark")}>Темная</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn("cursor-pointer", theme === "system" ? "btn_blue" : "btn_hover")}
          onClick={() => setTheme("system")}
        >
          <span className={cn(theme === "system")}>Системная</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
