import React from "react";

const UserFormSkeleton = () => {
  return (
    <div className="grid max-h-[85vh] gap-5 overflow-y-auto p-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="grid gap-3">
          <div className="h-5 w-32 animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
          <div className="h-8 w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
        </div>
      ))}

      <div className="h-12 w-full animate-pulse rounded-xl dark:bg-muted/50 bg-black/20" />
    </div>
  );
};

export default UserFormSkeleton;
