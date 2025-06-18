import React from "react";

const loading = () => {
  return (
    <div className="grid gap-5 p-5">
      <div className="h-10 w-full animate-pulse rounded-xl bg-muted/50" />
      <div className="h-16 w-full animate-pulse rounded-xl bg-muted/50" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-muted/50" />
      <div className="grid sm:grid-cols-2 gap-2">
        <div className="h-60 w-full animate-pulse rounded-xl bg-muted/50" />
        <div className="h-60 w-full animate-pulse rounded-xl bg-muted/50" />
      </div>
    </div>
  );
};

export default loading;
