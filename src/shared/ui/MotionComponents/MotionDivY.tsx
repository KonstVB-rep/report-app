import { motion } from "motion/react";
import React from "react";

const MotionDivY = ({ children, keyValue, className='' }: { children: React.ReactNode , keyValue?: string, className?: string}) => {
  return (
    <motion.div
      key={keyValue || ''}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MotionDivY;
