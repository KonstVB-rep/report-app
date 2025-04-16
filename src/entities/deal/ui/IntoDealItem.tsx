"use client";

import React from "react";

import { motion } from "motion/react";

import { cn } from "@/shared/lib/utils";

type IntoDealItemProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const IntoDealItem = ({
  title,
  children,
  className = "",
}: IntoDealItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn("overflow-hidden rounded-md border", className)}
    >
      <p className="first-letter:capitalize bg-muted p-4">{title}</p>
      <div className="flex-1 p-3">{children}</div>
    </motion.div>
  );
};

export default IntoDealItem;
