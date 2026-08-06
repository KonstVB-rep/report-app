"use client"

import Link from "next/link"

export default function Forbidden() {
  return (
    <div>
      <h2>Доступ запрещён</h2>
      <p>У вас нет прав для доступа к этому ресурсу.</p>
      <Link href="/" onClick={() => localStorage.removeItem("lastAppPath")}>
        Вернуться на главную
      </Link>
    </div>
  )
}
