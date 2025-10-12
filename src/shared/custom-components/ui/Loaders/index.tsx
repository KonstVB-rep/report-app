import { Loader } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export const LoaderCircle = ({
  className = "h-20 bg-muted rounded-md",
  classSpin = "h-10 w-10",
}: {
  className?: string
  classSpin?: string
}) => {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader className={cn("animate-spin", classSpin)} />
    </div>
  )
}

export const LoaderCircleInWater = () => {
  return (
    <div className="relative flex items-center justify-center flex-1 p-4">
      <span className="loader" />
    </div>
  )
}
