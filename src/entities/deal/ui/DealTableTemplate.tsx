import { PermissionEnum } from "@prisma/client";

import React from "react";

import { useParams } from "next/navigation";

import { useGetUser } from "@/entities/user/hooks/query";

import DealsSkeleton from "./DealsSkeleton";
import ErrorMessageTable from "./ErrorMessageTable";
import { motion } from "motion/react";

const DealTableTemplate = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useParams();

  const {
    data: user,
    error,
    isPending,
  } = useGetUser(userId as string, [PermissionEnum.VIEW_USER_REPORT]);

  if (isPending) return <DealsSkeleton />;

  return (
    <motion.section
      className="h-full p-4"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 1, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.25 }}
    >
      {user ? (
        <div className="grid gap-2">{children}</div>
      ) : (
        <ErrorMessageTable message={error?.message} />
      )}
    </motion.section>
  );
};

export default DealTableTemplate;
