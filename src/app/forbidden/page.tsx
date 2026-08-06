"use client"

import BackToHomeButton from "@/shared/custom-components/ui/Buttons/BackToHomeButton"

export default function Forbidden() {
  return (
    <div>
      <h2>Доступ запрещён</h2>
      <p>У вас нет прав для доступа к этому ресурсу.</p>
      <BackToHomeButton />
    </div>
  )
}
