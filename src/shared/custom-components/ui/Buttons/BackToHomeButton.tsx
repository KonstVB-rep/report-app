"use client" // Обязательно в самом верху!

import { Button } from "@/shared/components/ui/button"
import Link from "next/link"

export default function BackToHomeButton() {
  const handleClick = () => {
    // Теперь мы в браузере, localStorage доступен
    localStorage.removeItem("lastAppPath")
  }

  return (
    <Button asChild>
      <Link href="/" onClick={handleClick}>
        Вернуться на главную страницу
      </Link>
    </Button>
  )
}
