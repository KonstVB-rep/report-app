"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Redo2 } from "lucide-react";

import useStoreUser from "@/entities/user/store/useStoreUser";
import Overlay from "@/shared/ui/Overlay";
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
  const [isLoading, setIsLoading] = useState(false);
  const { authUser } = useStoreUser();
  const pathname = usePathname();
  const [hasTable, setHasTable] = useState<null | {
    title: string;
    url: string;
  }>(null);

  const [hasSummaryTable, setHasSummaryTable] = useState<null | {
    title: string;
    url: string;
  }>(null);

  const handleClick = () => setIsLoading(true);

  useEffect(() => {
    setIsLoading(false);
    if (!authUser) return;

    const tableLinks = linksPersonTable(departmentId as string);
    const summaryTableLinks = linksSummaryTable(authUser.departmentId);

    if (pathname.includes(`/table/${departmentId}/${dealType}/${userId}`)) {
      setHasTable(tableLinks[dealType as DealsUnionType]);
    } else {
      setHasTable(null);
    }

    if (
      pathname.includes(
        `/summary-table/${authUser.departmentId}/${dealType}/${authUser?.id}`
      )
    ) {
      setHasSummaryTable(summaryTableLinks[dealType as DealsUnionType]);
    } else {
      setHasSummaryTable(null);
    }
  }, [authUser, departmentId, dealType, pathname, userId]);

  if (!authUser) {
    return null;
  }

  return (
    <>
      <Overlay isPending={isLoading} className="animate animate-pulse" />
      {hasTable && (
        <Link
          className="btn_hover max-w-max border-muted px-4 text-sm"
          href={`${hasTable.url}/${userId}`}
          title={`Перейти на страницу - ${hasTable.title}`}
          onClick={handleClick}
        >
          {hasTable.title} <Redo2 size={14} />
        </Link>
      )}
      {hasSummaryTable && (
        <ProtectedByPermissions permissionArr={["VIEW_UNION_REPORT"]}>
          <Link
            className="btn_hover max-w-max border-muted px-4 text-sm"
            href={`${hasSummaryTable.url}/${authUser.id}`}
            title={`Перейти на страницу - ${hasSummaryTable.title}`}
            onClick={handleClick}
          >
            {hasSummaryTable.title} <Redo2 size={14} />
          </Link>
        </ProtectedByPermissions>
      )}
    </>
  );
};

export default LinkToUserTable;
