"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import React from "react";

import Link from "next/link";

import useStoreUser from "@/entities/user/store/useStoreUser";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

type Props = {
  type: DealType;
  className?: string;
  departmentId?: string;
};

const SummaryTableLink = ({
  type,
  className = "",
  departmentId,
}: Props) => {
  const { authUser } = useStoreUser();

  if (!authUser) return null;

  const name = {
    [DealType.PROJECT]: "Проекты",
    [DealType.RETAIL]: "Розничные сделки",
  };

  const departmentIdValue =
    departmentId !== undefined ? departmentId : authUser.departmentId;

  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}>
      <Link
        href={`/dashboard/summary-table/${departmentIdValue}/${type.toLowerCase()}s/${authUser.id}`}
        className={`${className} min-w-full max-w-max text-sm`}
        title="перейти на страницу сводной таблицы"
      >
        <span className="first-letter:capitalize">
          {name[type as keyof typeof name] as string}
        </span>
      </Link>
    </ProtectedByPermissions>
  );
};

export default SummaryTableLink;
