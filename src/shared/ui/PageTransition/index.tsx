"use client";

import React from "react";

import { AnimatePresence, motion } from "motion/react";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      <motion.div
        key={Date.now()}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 1, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.25 }}
        className="w-full h-full flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
