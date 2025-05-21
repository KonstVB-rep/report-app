"use client";

import React from "react";

const Loading = () => {
  return (
    <section className="grid p-4">
      <div className="h-20 w-full animate-pulse rounded-xl bg-muted/50" />
      <div className="grid gap-2 py-2">
        <div className="grid grid-cols-[0.4fr_1fr] gap-2">
          <div className="h-52 animate-pulse rounded-xl bg-muted/50" />
          <div className="h-52 animate-pulse rounded-xl bg-muted/50" />
        </div>
        <div className="grid grid-cols-[0.4fr_1fr] gap-2">
          <div className="h-52 animate-pulse rounded-xl bg-muted/50" />
          <div className="h-52 animate-pulse rounded-xl bg-muted/50" />
        </div>
        <div className="h-32 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-32 animate-pulse rounded-xl bg-muted/50" />
      </div>
    </section>
  );
};

export default Loading;
