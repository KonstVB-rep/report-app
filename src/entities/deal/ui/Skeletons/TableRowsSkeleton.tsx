import React from "react";

const TableRowsSkeleton = () => {
  return (
    <div className="relative grid gap-1 content-start">
      <div className="m-auto my-1 h-14 w-full animate-pulse rounded-lg bg-muted/50" />
      <div className="m-auto my-1 h-[50vh] w-full animate-pulse rounded-lg bg-muted/50" />
    </div>
  );
};

export default TableRowsSkeleton;
