import { v4 as uuid } from "uuid"

const SkeletonFiles = () => {
  return (
    <div className="grid gap-2 overflow-hidden rounded-md border border-solid">
      <div className="h-20 w-full animate-pulse rounded-md dark:bg-muted/50 bg-black/20" />

      <div className="flex gap-2 p-4">
        {new Array(3).fill(null).map(() => (
          <div
            className="h-20 w-20 animate-pulse rounded-md dark:bg-muted/50 bg-black/20"
            key={uuid()}
          />
        ))}
      </div>
    </div>
  )
}

export default SkeletonFiles
