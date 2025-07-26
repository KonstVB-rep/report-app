"use client";

import MotionDivY from "../MotionDivY";

interface PageTransitionYProps {
  children: React.ReactNode;
}


const PageTransitionY = ({ children }: PageTransitionYProps) => {

  return (
    <MotionDivY>
      {children}
    </MotionDivY>
  );
};

export default PageTransitionY;
