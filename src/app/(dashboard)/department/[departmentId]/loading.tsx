import React from "react";

const Loading = () => {
  return (
    <div className="grid gap-5">
      <div className="h-14 w-full max-w-[300px] animate-pulse rounded-md bg-muted m-auto" />
      <div className="grid gap-2">
        <div className="h-14 w-full max-w-[560px] animate-pulse rounded-md bg-muted m-auto" />
        <div className="h-14 w-full max-w-[560px] animate-pulse rounded-md bg-muted m-auto" />
        <div className="h-14 w-full max-w-[560px] animate-pulse rounded-md bg-muted m-auto" />
        <div className="h-14 w-full max-w-[560px] animate-pulse rounded-md bg-muted m-auto" />
        <div className="h-14 w-full max-w-[560px] animate-pulse rounded-md bg-muted m-auto" />
      </div>
    </div>
  );
};

export default Loading;
