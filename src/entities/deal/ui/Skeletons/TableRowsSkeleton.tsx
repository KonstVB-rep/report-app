import React from "react";

const TableRowsSkeleton = () => {
  return (
    <div className="relative grid gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="m-auto my-1 h-14 w-full animate-pulse rounded-lg bg-muted/50"
        >
          {index === 2 ? (
            <p className="absolute left-1/2 top-1/2 flex h-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <span className="loader-table-content" />
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default TableRowsSkeleton;
