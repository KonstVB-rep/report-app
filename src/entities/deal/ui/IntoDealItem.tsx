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
}: IntoDealItemProps) => {
  return (
    <div className={cn("overflow-hidden rounded-md border", className)}>
      <p className="first-letter:capitalize bg-muted p-4">{title}</p>
      <div className="flex-1 p-3 grid gap-2">{children}</div>
    </div>
  );
};

export default IntoDealItem;
