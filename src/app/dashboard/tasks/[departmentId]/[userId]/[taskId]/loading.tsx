import React from "react";

const Loading = () => {
  return (
    <div className="p-5 grid gap-4">
      <div className="max-w-28 h-10 w-full flex flex-wrap gap-3">
        <div className="animate-pulse h-full flex-1 rounded-md dark:bg-muted/50 bg-black/20" />
        <div className="animate-pulse h-full flex-1 rounded-md dark:bg-muted/50 bg-black/20" />
      </div>

      <div className="max-w-52 h-10 w-full flex flex-wrap gap-3">
        <div className="animate-pulse h-full flex-1 rounded-md dark:bg-muted/50 bg-black/20" />
        <div className="animate-pulse h-full flex-1 rounded-md dark:bg-muted/50 bg-black/20" />
      </div>

      <div className="max-w-xl h-[40vh] w-full animate-pulse rounded-md dark:bg-muted/50 bg-black/20" />
    </div>
  );
};

export default Loading;
