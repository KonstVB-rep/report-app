"use client";
import { PrismaPermissionsMap } from "@/entities/user/model/objectTypes";
import useStoreUser from "@/entities/user/store/useStoreUser";
import Protected from "@/feature/Protected";
import { DealType } from "@prisma/client";
import Link from "next/link";

import React from "react";

type Props = {
  type: DealType;
};

const SummaryTableLink = ({type} : Props) => {
  const { authUser } = useStoreUser();

  if (!authUser) return null;

  const name = {
    [DealType.PROJECT]: 'Проекты',
    [DealType.RETAIL]: 'Розничные сделки',
  }
  return (
    <Protected permissionOptional={[PrismaPermissionsMap.VIEW_UNION_REPORT]}>
      <Link
        href={`/dashboard/summary-table/${type.toLowerCase()}s/${authUser.id}`}
        className="btn_hover max-w-max text-sm border-muted min-w-full"
        title="перейти на страницу сводной таблицы"
      >
       <span className="first-letter:capitalize">{name[type as keyof typeof name] as string}</span>
      </Link>
    </Protected>
  );
};

export default SummaryTableLink;
