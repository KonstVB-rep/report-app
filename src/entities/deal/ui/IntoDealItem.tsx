"use client";

import React from "react";

import { cn } from "@/shared/lib/utils";

type IntoDealItemProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const IntoDealItem = ({
  title,
  children,
  className = "",
}: IntoDealItemProps) => (
  <div
    className={cn(
      "overflow-hidden rounded-md border bg-zinc-200 dark:bg-zinc-800",
      className
    )}
  >
    <p className="break-all first-letter:capitalize bg-stone-100 dark:bg-black/40 p-4 font-medium">
      {title}
    </p>
    <div className="flex-1 p-3 grid gap-2">{children}</div>
  </div>
);

export default IntoDealItem;
