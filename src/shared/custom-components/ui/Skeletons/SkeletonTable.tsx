import { v4 as uuid } from "uuid"
import { cn } from "@/shared/lib/utils"

export const SkeletonTable = ({
  className,
  number = 5,
  innerTable = true,
}: {
  className?: string
  number?: number
  innerTable?: boolean
}) => (
  <>
    {innerTable ? (
      <tr className={cn("flex flex-col space-y-2", className)}>
        {[...Array(number)].map(() => (
          <td className={cn("w-full bg-muted rounded-md animate-pulse h-[57px]")} key={uuid()} />
        ))}
      </tr>
    ) : (
      <div className={cn("flex flex-col space-y-2", className)}>
        {[...Array(number)].map((_, i) => (
          <div
            className={cn(
              "w-full bg-muted rounded-md animate-pulse",
              i === 0 ? "h-20" : "h-[57px]",
            )}
            key={uuid()}
          />
        ))}
      </div>
    )}
  </>
)
