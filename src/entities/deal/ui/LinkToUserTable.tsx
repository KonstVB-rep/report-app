"use client";

import { PermissionEnum } from "@prisma/client";

import { useMemo, useState } from "react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Redo2 } from "lucide-react";

import useStoreUser from "@/entities/user/store/useStoreUser";
import Overlay from "@/shared/custom-components/ui/Overlay";
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions";

import { DealsUnionType } from "../types";

const linksPersonTable = (deptId: string | number) => ({
  retails: {
    title: "Проекты",
    url: `/table/${deptId}/projects`,
  },
  projects: {
    title: "Розничные сделки",
    url: `/table/${deptId}/retails`,
  },
});

const linksSummaryTable = (deptId: string | number) => ({
  retails: {
    title: "Проекты/Сводная таблица",
    url: `/summary-table/${deptId}/projects`,
  },
  projects: {
    title: "Розничные сделки/Сводная таблица",
    url: `/summary-table/${deptId}/retails`,
  },
});

const LinkToUserTable = () => {
  const { dealType, userId, departmentId } = useParams();
  const { authUser } = useStoreUser();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => setIsLoading(true);

  const hasTable = useMemo(() => {
    if (!dealType || !userId || !departmentId) return null;
    if (!pathname.includes(`/table/${departmentId}/${dealType}/${userId}`))
      return null;
    return linksPersonTable(departmentId as string)[dealType as DealsUnionType];
  }, [pathname, dealType, departmentId, userId]);

  const hasSummaryTable = useMemo(() => {
    if (!authUser || !dealType) return null;
    if (
      !pathname.includes(
        `/summary-table/${authUser.departmentId}/${dealType}/${authUser.id}`
      )
    )
      return null;
    return linksSummaryTable(authUser.departmentId)[dealType as DealsUnionType];
  }, [pathname, dealType, authUser]);

  if (!authUser) return null;

  return (
    <>
      <Overlay isPending={isLoading} className="animate animate-pulse" />
      {hasTable && (
        <Link
          href={`/dashboard/${hasTable.url}/${userId}`}
          className="btn_hover max-w-max border-muted px-4 text-sm"
          title={`Перейти на страницу - ${hasTable.title}`}
          onClick={handleClick}
        >
          {hasTable.title} <Redo2 size={14} />
        </Link>
      )}

      {hasSummaryTable && (
        <ProtectedByPermissions
          permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}
        >
          <Link
            href={`/dashboard/${hasSummaryTable.url}/${authUser.id}`}
            className="btn_hover max-w-max border-muted px-4 text-sm"
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
