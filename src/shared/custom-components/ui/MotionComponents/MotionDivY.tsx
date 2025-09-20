import React from "react";

import { cn } from "@/shared/lib/utils";

const MotionDivY = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
      <div className={cn("animate-slide-appear", className)}>{children}</div>
  );
};

export default MotionDivY;
