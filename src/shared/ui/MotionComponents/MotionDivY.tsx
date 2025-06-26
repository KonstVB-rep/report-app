import React, { Ref } from "react";

import { motion } from "motion/react";

const MotionDivY = ({
  children,
  keyValue,
  className = "",
  ref,
}: {
  children: React.ReactNode;
  keyValue?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) => {
  return (
    <motion.div
      key={keyValue || ""}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={className}
      ref={ref}
    >
      {children}
    </motion.div>
  );
};

export default MotionDivY;
