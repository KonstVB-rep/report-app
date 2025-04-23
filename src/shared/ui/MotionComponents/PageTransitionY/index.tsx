"use client";

import { AnimatePresence } from "motion/react";

import MotionDivY from "../MotionDivY";

const PageTransitionY = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <MotionDivY>{children}</MotionDivY>
    </AnimatePresence>
  );
};

export default PageTransitionY;
