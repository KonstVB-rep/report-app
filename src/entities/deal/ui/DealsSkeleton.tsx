import React from "react";

const DealsSkeleton = () => {
  return (
    <section className="h-full p-4">
      <div className="grid h-full grid-rows-[auto_auto_1fr] content-start gap-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-40 animate-pulse rounded-xl bg-muted/50" />
        </div>
        <div>
          <div className="h-10 w-40 animate-pulse rounded-xl bg-muted/50" />
        </div>
        <div className="h-full max-h-[80vh] w-full animate-pulse rounded-xl bg-muted/50" />
      </div>
    </section>
  );
};

export default DealsSkeleton;
