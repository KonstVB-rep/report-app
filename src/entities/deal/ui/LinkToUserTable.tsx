"use client";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { Redo2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { DealsUnionType } from "../types";

const linksPersonTable = {
  retails: {
    title: "Проекты",
    url: "/table/projects",
  },
  projects: {
    title: "Розничные сделки",
    url: "/table/retails",
  },
};

const linksSummaryTable = (
  deptId: string | number
): Record<DealsUnionType, { title: string; url: string }> => {
  return {
    retails: {
      title: "Проекты",
      url: `/summary-table/${deptId}/projects`,
    },
    projects: {
      title: "Розничные сделки",
      url: `/summary-table/${deptId}/retails`,
    },
  };
};

const LinkToUserTable = () => {
  const { dealType, userId } = useParams();
  const { authUser } = useStoreUser();
  const pathname = usePathname();

  if (!authUser) {
    return null;
  }

  const hasTable = pathname.includes(`/table/${dealType}/${userId}`)
    ? linksPersonTable[dealType as keyof typeof linksPersonTable]
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
      <Link
        className="btn_hover max-w-max border-muted px-4 text-sm"
        href={`${hasSummaryTable.url}/${authUser.id}`}
        title={`Перейти на страницу - ${hasSummaryTable.title}`}
      >
        {hasSummaryTable.title} <Redo2 size={14} />
      </Link>
    );
  }
};

export default LinkToUserTable;
