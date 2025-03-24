"use client";

import React from "react";

const Loading = () => {
  return (
    <section className="grid p-4">
      <div className="grid gap-2">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-10 w-40 animate-pulse rounded-xl bg-muted/50" />
      </div>
      <div className="grid-container gap-2 py-2">
        <div className="h-40 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-40 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-40 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-40 animate-pulse rounded-xl bg-muted/50" />
      </div>
      <div className="h-20 w-full animate-pulse rounded-xl bg-muted/50" />
    </section>
  );
};

export default Loading;
