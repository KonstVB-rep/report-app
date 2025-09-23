import React from "react";

import { cn } from "@/shared/lib/utils";

const MotionDivY = ({
  children,
  className = "",
  keyValue,
}: {
  children: React.ReactNode;
  className?: string;
  keyValue?: string | number;
}) => {
  return (
    <div key={keyValue} className={cn("animate-slide-appear", className)}>
      {children}
    </div>
  );
};

export default MotionDivY;
