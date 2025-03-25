import React from "react";

const FormEditSkeleton = () => {
  return (
    <div className="grid max-h-[85vh] gap-10 overflow-y-auto">
      <div className="m-auto h-14 w-64 animate-pulse rounded-lg bg-muted/50" />
      <div className="grid gap-2 p-1 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          {Array(6)
            .fill("")
            .map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="h-5 w-32 animate-pulse rounded-lg bg-muted/50" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted/50" />
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-4">
          {Array(6)
            .fill("")
            .map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="h-5 w-32 animate-pulse rounded-lg bg-muted/50" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted/50" />
              </div>
            ))}
        </div>
      </div>
      <div className="ml-auto h-12 w-32 animate-pulse rounded-lg bg-muted/50" />
    </div>
  );
};

export default FormEditSkeleton;
