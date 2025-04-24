import React from "react";

const loading = () => {
  return (
    <div className="grid grid-cols-[1.25fr_1fr] aspect-square justify-start gap-2 p-4 h-full min-h-[400px] max-h-[400px] w-[min(560px,100%)]">
      <div className="h-full w-full animate-pulse rounded-md bg-muted" />
      <div className="h-full w-full animate-pulse rounded-md bg-muted" />
    </div>
  );
};

export default loading;
