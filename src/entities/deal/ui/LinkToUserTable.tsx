"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Redo2 } from "lucide-react";

import useStoreUser from "@/entities/user/store/useStoreUser";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

import { DealsUnionType } from "../types";

const linksPersonTable = (
  deptId: string | number
): Record<DealsUnionType, { title: string; url: string }> => {
  return {
    retails: {
      title: "Проекты",
      url: `/table/${deptId}/projects`,
    },
    projects: {
      title: "Розничные сделки",
      url: `/table/${deptId}/retails`,
    },
  };
};

const linksSummaryTable = (
  deptId: string | number
): Record<DealsUnionType, { title: string; url: string }> => {
  return {
    retails: {
      title: "Проекты/Сводная таблица",
      url: `/summary-table/${deptId}/projects`,
    },
    projects: {
      title: "Розничные сделки/Сводная таблица",
      url: `/summary-table/${deptId}/retails`,
    },
  };
};

const LinkToUserTable = () => {
  const { dealType, userId, departmentId } = useParams();
  const { authUser } = useStoreUser();
  const pathname = usePathname();

  if (!authUser) {
    return null;
  }

  const tableLinks = linksPersonTable(departmentId as string);

  const hasTable = pathname.includes(
    `/table/${departmentId}/${dealType}/${userId}`
  )
    ? tableLinks[dealType as DealsUnionType]
    : false;

  const summaryTableLinks = linksSummaryTable(authUser.departmentId);

  const hasSummaryTable = pathname.includes(
    `/summary-table/${authUser.departmentId}/${dealType}/${authUser?.id}`
  )
    ? summaryTableLinks[dealType as DealsUnionType]
    : false;

  if (!hasTable && !hasSummaryTable) return null;

  if (hasTable) {
    return (
      <Link
        className="btn_hover max-w-max border-muted px-4 text-sm"
        href={`${hasTable.url}/${userId}`}
        title={`Перейти на страницу - ${hasTable.title}`}
      >
        {hasTable.title} <Redo2 size={14} />
      </Link>
    );
  }

  if (hasSummaryTable) {
    return (
      <ProtectedByPermissions permissionArr={["VIEW_UNION_REPORT"]}>
        <Link
          className="btn_hover max-w-max border-muted px-4 text-sm"
          href={`${hasSummaryTable.url}/${authUser.id}`}
          title={`Перейти на страницу - ${hasSummaryTable.title}`}
        >
          {hasSummaryTable.title} <Redo2 size={14} />
        </Link>
      </ProtectedByPermissions>
    );
  }
};

export default LinkToUserTable;
