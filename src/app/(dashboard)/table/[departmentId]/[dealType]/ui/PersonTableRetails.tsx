"use client";
import { useGetRetailsUser } from "@/entities/deal/hooks/query";
import { RetailResponse } from "@/entities/deal/types";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataRetail } from "../[userId]/model/columns-data-retail";
import PersonTable from "./PersonTable";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import useRedirectToLoginNotAuthUser from "@/shared/hooks/useRedirectToLoginNotAuthUser";
import { useCallback } from "react";
import dynamic from "next/dynamic";

const AccessDeniedMessage = dynamic(() => import("@/shared/ui/AccessDeniedMessage"), { ssr: false });

const PersonTableRetail = ({ userId }: { userId: string }) => {
  useRedirectToLoginNotAuthUser();
  
  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  const { data: deals } = useGetRetailsUser(
    hasAccess ? (userId as string) : null
  );

  const getRowLink = useCallback((row: RetailResponse) => `/deal/retail/${row.id}`,[]);

  if (!hasAccess)
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );


  return (
    <PersonTable
      data={deals ?? []}
      type={DealType.RETAIL}
      columns={columnsDataRetail}
      getRowLink={getRowLink}
    />
  );
};

export default PersonTableRetail;
