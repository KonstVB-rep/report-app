import type { ReactNode } from "react"
import { cn } from "@/shared/lib/utils"

const ValueSpan = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <span
      className={cn(
        "break-normal text-sm prop-deal-value min-h-10 p-3 flex-1 bg-white dark:bg-black",
        className,
      )}
    >
      {children}
    </span>
  )
}

export default ValueSpan
