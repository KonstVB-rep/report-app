"use client";
import { useGetRetailsUser } from "@/entities/deal/hooks/query";
import { RetailResponse } from "@/entities/deal/types";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataRetail } from "../[userId]/model/columns-data-retail";
import PersonTable from "./PersonTable";
import AccessDeniedMessage from "@/shared/ui/AccessDeniedMessage";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";

const PersonTableRetail = ({ userId }: { userId: string }) => {
  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  // Передаём userId только если есть доступ, иначе null
  const { data: deals } = useGetRetailsUser(
    hasAccess ? (userId as string) : null
  );

  if (!hasAccess)
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );

  const getRowLink = (row: RetailResponse) => `/deal/retail/${row.id}`;

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
