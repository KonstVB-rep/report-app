"use client";
import { PrismaPermissionsMap } from "@/entities/user/model/objectTypes";
import useStoreUser from "@/entities/user/store/useStoreUser";
import Protected from "@/feature/Protected";
import Link from "next/link";

import React from "react";

const SummaryTableLink = () => {
  const { authUser } = useStoreUser();
  if (!authUser) return null;
  return (
    <Protected permissionOptional={[PrismaPermissionsMap.VIEW_UNION_REPORT]}>
      <Link
        href={`/dashboard/summary-table/${authUser.id}`}
        className="btn_hover max-w-max text-sm border-muted"
        title="перейти на страницу сводной таблицы"
      >
        Сводная таблица отчетов
      </Link>
    </Protected>
  );
};

export default SummaryTableLink;
