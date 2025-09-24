"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import React from "react";

import Link from "next/link";

import useStoreUser from "@/entities/user/store/useStoreUser";
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions";

type Props = {
  type: DealType;
  className?: string;
  departmentId?: string;
  protect?: boolean;
};

const DEAL_TYPE = {
  [DealType.PROJECT]: "Проекты",
  [DealType.RETAIL]: "Розничные сделки",
};

const SummaryTableLink = ({ type, className = "", departmentId, protect = true }: Props) => {
  const { authUser } = useStoreUser();

  if (!authUser) return null;

  const departmentIdValue =
    departmentId !== undefined ? departmentId : authUser.departmentId;

  return (
    <ProtectedByPermissions permission={PermissionEnum.VIEW_UNION_REPORT}>
      <Link
        prefetch={false}
        href={`/dashboard/summary-table/${departmentIdValue}/${type.toLowerCase()}s/${authUser.id}`}
        className={`${className} min-w-full max-w-max text-sm`}
        title="перейти на страницу сводной таблицы"
      >
        <span className="first-letter:capitalize">
          {DEAL_TYPE[type as keyof typeof DEAL_TYPE] as string}
        </span>
      </Link>
    </ProtectedByPermissions>
  );
};

export default SummaryTableLink;
