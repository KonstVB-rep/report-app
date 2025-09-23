"use client";

import MotionDivY from "../MotionDivY";

interface PageTransitionYProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransitionY = ({ children, className }: PageTransitionYProps) => {
  return <MotionDivY className={className}>{children}</MotionDivY>;
};

export default PageTransitionY;
