import React, { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

const ValueSpan = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "break-normal text-md prop-deal-value min-h-10 px-2 py-1 flex-1 bg-white dark:bg-black",
        className
      )}
    >
      {children}
    </span>
  );
};

export default ValueSpan;
