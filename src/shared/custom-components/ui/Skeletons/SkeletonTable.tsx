import { cn } from "@/shared/lib/utils";

export const SkeletonTable = ({
  className,
  number = 5,
  innerTable = true,
}: {
  className?: string;
  number?: number;
  innerTable?: boolean;
}) => (
  <>
    {innerTable ? (
      <>
        <tr className={cn("flex flex-col space-y-2", className)}>
          {[...Array(number)].map((_, i) => (
            <td
              key={i}
              className={cn(
                "w-full bg-muted rounded-md animate-pulse h-[57px]"
              )}
            />
          ))}
        </tr>
      </>
    ) : (
      <div className={cn("flex flex-col space-y-2", className)}>
        {[...Array(number)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-full bg-muted rounded-md animate-pulse",
              i === 0 ? "h-20" : "h-[57px]"
            )}
          />
        ))}
      </div>
    )}
  </>
);
