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
        "bg-stone-800/20 backdrop-blur-sm flex items-center justify-center left-1/2 -translate-x-2/4 gap-2 border absolute h-20 rounded-xl w-max p-4",
        `${positionSide}`,
      )}
    >
      {children}
    </div>
  )
}

export default DrawerComponent
