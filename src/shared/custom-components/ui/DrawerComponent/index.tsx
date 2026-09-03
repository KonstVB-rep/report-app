import type { ReactNode } from "react"
import { cn } from "@/shared/lib/utils"

const DrawerComponent = ({
  children,
  positionSide,
}: {
  positionSide: string
  children: ReactNode
}) => {
  return (
    <div
      className={cn(
        "bg-stone-800/20 backdrop-blur-sm flex items-center justify-center left-1/2 -translate-x-2/4 absolute h-auto rounded-xl",
        `${positionSide}`,
      )}
    >
      {children}
    </div>
  )
}

export default DrawerComponent
