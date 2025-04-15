import React from "react";

const SkeletonFiles = () => {
  return (
    <div className="grid gap-2 overflow-hidden rounded-md border border-solid">
      <div className="h-20 w-full animate-pulse rounded-md bg-muted/50" />
      
      <div className="flex gap-2 p-4">
        {new Array(3).fill(null).map((_, index) => (
          <div
            key={index}
            className="h-20 w-20 animate-pulse rounded-md bg-muted/50"
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonFiles;
