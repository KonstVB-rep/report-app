import React from "react";

const YandexDiskInfoSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
      <div className="h-12 w-1/2 animate-pulse rounded-md bg-muted" />
    </div>
  );
};

export default YandexDiskInfoSkeleton;
