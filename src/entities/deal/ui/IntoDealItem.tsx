import { cn } from "@/shared/lib/utils";
import React from "react";

type IntoDealItemProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const IntoDealItem = ({ title, children, className='' }: IntoDealItemProps) => {
  return (
    <div className={cn("overflow-hidden rounded-md border", className)}>
      <p className="bg-muted p-4 firtst-letter:capitalize">{title}</p>
      
      <div className="p-3">{children}</div>
    </div>
  );
};

export default IntoDealItem;
