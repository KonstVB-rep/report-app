import React from "react";

const SKELETON_ITEMS_COUNT = 4;

const FormOrderSkeleton = () => {
  return (
    <div className="grid max-h-[60vh] gap-8 overflow-y-auto">
      <div className="m-auto h-14 w-64 animate-pulse rounded-lg bg-muted/50" />

      <div className="grid gap-2 p-1 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {Array.from({ length: SKELETON_ITEMS_COUNT }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex flex-col gap-4">
                <div className="h-5 w-32 animate-pulse rounded-lg bg-muted/50" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted/50" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="ml-auto h-12 w-32 animate-pulse rounded-lg bg-muted/50" />
    </div>
  );
};

export default FormOrderSkeleton;
