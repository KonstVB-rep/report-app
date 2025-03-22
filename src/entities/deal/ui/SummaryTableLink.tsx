"use client";

import useStoreUser from "@/entities/user/store/useStoreUser";
import ProtectedByPermissions from "@/shared/ui/ProtectedByPermissions";
import { DealType, PermissionEnum } from "@prisma/client";
import Link from "next/link";

import React from "react";

type Props = {
  type: DealType;
};

const SummaryTableLink = ({ type }: Props) => {
  const { authUser } = useStoreUser();

  if (!authUser) return null;

  const name = {
    [DealType.PROJECT]: "Проекты",
    [DealType.RETAIL]: "Розничные сделки",
  };
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}>
      <Link
        href={`/summary-table/${type.toLowerCase()}s/${authUser.id}`}
        className="btn_hover max-w-max text-sm border-muted min-w-full"
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
