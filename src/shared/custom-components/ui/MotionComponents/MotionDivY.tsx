import type React from "react"
import { cn } from "@/shared/lib/utils"

const MotionDivY = ({
  children,
  className = "",
  keyValue,
}: {
  children: React.ReactNode
  className?: string
  keyValue?: string | number
}) => {
  return (
    <div className={cn("animate-slide-appear", className)} key={keyValue}>
      {children}
    </div>
  )
}

export default MotionDivY
