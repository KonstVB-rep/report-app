import React from "react";

const DealsSkeleton = () => {
  return (
    <section className="h-full p-4">
      <div className="grid h-full grid-rows-[auto_1fr] content-start gap-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-40 animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />

          <div className="flex gap-2">
            <div className="h-10 w-40 animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />

            <div className="h-10 w-40 animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
          </div>
        </div>

        <div className="h-full max-h-[79vh] min-h-[50vh] w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
      </div>
    </section>
  );
};

export default DealsSkeleton;
