"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"

type TooltipComponent = {
  children: React.ReactNode
  content: string
}

const TooltipComponent = ({ children, content }: TooltipComponent) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  // На клиенте добавляем tooltip после монтирования
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent align="center" side="bottom">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default TooltipComponent
