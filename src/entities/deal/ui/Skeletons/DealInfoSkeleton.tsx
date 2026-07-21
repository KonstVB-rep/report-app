import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"

const DealInfoSkeleton = () => {
  return (
    <MotionDivY className="grid grid-rows-[auto_auto_1fr_auto] gap-1 p-4 max-h-[calc(100svh-var(--header-height)-2px)] overflow-auto w-full">
      <div className="flex items-center justify-between rounded-md bg-muted p-2 pb-2 animate-pulse">
        <div className="grid gap-1">
          <div className="h-8 w-32 bg-gray-300 dark:bg-zinc-700 rounded-md" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-600 rounded-sm" />
        </div>
        <div className="h-9 w-9 bg-gray-300 dark:bg-zinc-700 rounded-md" />
      </div>

      <div className="flex gap-2 overflow-hidden py-1">
        {[1, 2].map((i) => (
          <div
            className="h-10 w-32 bg-gray-200 dark:bg-zinc-700 rounded-md animate-pulse"
            key={i}
          />
        ))}
      </div>

      <div className="grid gap-2">
        <div className="flex gap-2 items-center p-2 mt-2 border-blue-500/20 rounded border-2 bg-blue-50/10 dark:bg-blue-900/10 animate-pulse">
          <div className="h-5 w-5 bg-orange-400/50 rounded-full" />
          <div className="h-5 w-64 bg-gray-300 dark:bg-zinc-700 rounded-sm" />
        </div>

        <div className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[1fr_2fr]">
          <div className="grid-rows-auto grid gap-2">
            <div className="grid min-w-64 gap-4 border rounded-lg p-4 bg-card animate-pulse">
              <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />

              <div className="grid w-full gap-2">
                <div className="flex w-full items-start justify-start gap-4 text-lg">
                  <div className="h-10 w-10 bg-gray-300 dark:bg-zinc-700 rounded-full" />
                  <div className="h-6 w-48 bg-gray-300 dark:bg-zinc-700 rounded-md mt-2" />
                </div>

                <div className="first-letter:capitalize mt-2">
                  <div className="flex flex-col gap-2 justify-start">
                    <div className="flex items-center justify-start gap-4">
                      <div className="h-10 w-10 bg-gray-300 dark:bg-zinc-700 rounded-full" />
                      <div className="h-6 w-32 bg-gray-300 dark:bg-zinc-700 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2 border rounded-lg p-4 bg-card animate-pulse">
              <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-zinc-600 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-600 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-600 rounded" />
              </div>
            </div>
          </div>

          <div className="grid-rows-auto grid gap-2">
            <div className="flex flex-wrap gap-2">
              <div className="flex-item-contact border rounded-lg p-4 bg-card flex-1 min-w-[200px] animate-pulse">
                <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-700 rounded mb-4" />
                <div className="grid gap-3">
                  <div className="h-4 w-full bg-gray-200 dark:bg-zinc-600 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-600 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-600 rounded" />
                </div>
              </div>

              <div className="flex-item-contact border rounded-lg p-4 bg-card flex-1 min-w-[200px] animate-pulse">
                <div className="h-5 w-20 bg-gray-200 dark:bg-zinc-700 rounded mb-4" />
                <div className="grid gap-3">
                  <div className="h-4 w-full bg-gray-200 dark:bg-zinc-600 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-600 rounded" />
                  <hr className="w-full h-px rounded-lg bg-gray-300 dark:bg-zinc-700 my-2" />
                  <div className="h-12 w-full bg-gray-200 dark:bg-zinc-600 rounded" />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-card animate-pulse">
              <div className="h-5 w-48 bg-gray-200 dark:bg-zinc-700 rounded mb-3" />
              <div className="flex h-full flex-wrap gap-2">
                {[1, 2].map((i) => (
                  <div className="h-16 w-32 bg-gray-200 dark:bg-zinc-700 rounded-md" key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-card animate-pulse">
          <div className="h-5 w-32 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-600 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-zinc-600 rounded mt-1" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <div className="h-24 w-24 bg-gray-200 dark:bg-zinc-700 rounded-md animate-pulse" />
        <div className="h-24 w-24 bg-gray-200 dark:bg-zinc-700 rounded-md animate-pulse" />
        <div className="h-24 w-24 bg-gray-200 dark:bg-zinc-700 rounded-md animate-pulse" />
      </div>
    </MotionDivY>
  )
}

export default DealInfoSkeleton
