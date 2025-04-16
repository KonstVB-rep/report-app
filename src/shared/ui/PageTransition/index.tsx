"use client";

import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "motion/react";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setDisplayChildren(children);
  }, [children]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
