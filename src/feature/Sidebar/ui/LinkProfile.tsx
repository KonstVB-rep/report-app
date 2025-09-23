import React, { memo } from "react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { UserRound } from "lucide-react";
import z from "zod";

import { DepartmentUserItem } from "@/entities/department/types";
import { useTypedParams } from "@/shared/hooks/useTypedParams";

const pageParamsSchema = z.object({
  userId: z.string().optional(),
});

const LinkProfile = ({ user }: { user: DepartmentUserItem }) => {
  const { userId } = useTypedParams(pageParamsSchema);

  const pathname = usePathname();

  const id = user.id;
  const departmentId = user.departmentId;

  return (
    <Link
      href={`/dashboard/profile/${departmentId}/${id}`}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`${
        (pathname !== `/dashboard/profile/${departmentId}/${id}` ||
          id !== userId) &&
        "text-primary dark:text-stone-400"
      } relative flex items-center gap-2 overflow-hidden rounded-md p-1 text-foreground transition-all duration-150 hover:bg-muted focus-visible:bg-muted focus-visible:text-foreground`}
    >
      <p className="relative z-1 flex h-full w-full items-center gap-2 rounded p-2 transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground">
        <UserRound
          size={
            pathname !== `/dashboard/profile/${departmentId}/${id}` ||
            id !== userId
              ? 12
              : 16
          }
        />{" "}
        <span>Профиль</span>
      </p>
      {pathname === `/dashboard/profile/${departmentId}/${id}` &&
        id === userId && (
          <div className="absolute right-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-md bg-blue-600" />
        )}
    </Link>
  );
};

export default memo(LinkProfile);
