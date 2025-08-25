import React from "react";

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-muted ${className}`}
    role="presentation"
    aria-hidden="true"
  />
);

const DeleteModalContentSkeleton = () => {
  return (
    <div className="grid gap-5">
      <Skeleton className="h-6 w-1/2 m-auto" />

      <div className="grid gap-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
    </div>
  );
};

export default DeleteModalContentSkeleton;
