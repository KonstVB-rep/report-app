"use client";

import { PermissionEnum } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import type {
  DealUnion,
  ProjectResponse,
  RetailResponse,
  TableType,
} from "@/entities/deal/types";
import ButtonsGroupTable from "@/entities/deal/ui/ButtonsGroupTable";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";
import { useDealsUser } from "@/feature/deals/api/hooks/query";
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage";
import NotFoundByPosition from "@/shared/custom-components/ui/Redirect/NotFoundByPosition";
import { columnsDataContract } from "../model/columns-data-contracts";
import { columnsDataProject } from "../model/columns-data-project";
import { columnsDataRetail } from "../model/columns-data-retail";
import DealsTable from "./DealsTable";

export const DealTypeLabels: Record<string, string> = {
  projects: "Проекты",
  retails: "Розничные сделки",
  contracts: "Договора",
  orders: "Заявки",
};

const Columns = (
  type: TableType,
):
  | ColumnDef<ProjectResponse, unknown>[]
  | ColumnDef<RetailResponse, unknown>[]
  | ColumnDef<ProjectResponse, unknown>[] => {
  switch (type) {
    case "projects":
      return columnsDataProject;
    case "retails":
      return columnsDataRetail;
    case "contracts":
      return columnsDataContract;
    default:
      return [];
  }
};

type HiddenColumns = Record<string, boolean>;

const hiddenDefCols: Record<TableType, HiddenColumns> = {
  projects: {
    resource: false,
    id: false,
  },
  retails: {
    resource: false,
    id: false,
  },
  contracts: {},
};

const PersonDealsTable = () => {
  const { dealType, userId } = useParams<{
    dealType: "retails" | "projects" | "contracts";
    userId: string;
  }>();

  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT,
  );

  const {
    data = [],
    isLoading,
    isPlaceholderData,
  } = useDealsUser(dealType as TableType, userId as string);

  if (!hasAccess)
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );

  return (
    <NotFoundByPosition>
      <DealTableTemplate>
        <div className="flex flex-wrap justify-between gap-3 w-full">
          <h1 className="text-lg uppercase flex-1 p-2 bg-muted rounded-md font-semibold">
            {DealTypeLabels[dealType as string]}
          </h1>
          <p className="border rounded-md p-2">
            Количество заявок: {data?.length}
          </p>
        </div>

        <ButtonsGroupTable />
        {isLoading ? (
          <TableRowsSkeleton />
        ) : (
          <div
            className={
              isPlaceholderData
                ? "opacity-50 transition-opacity"
                : "opacity-100"
            }
          >
            <DealsTable
              columns={Columns(dealType as TableType) as ColumnDef<DealUnion>[]}
              data={data as DealUnion[]}
              hiddenCols={hiddenDefCols[dealType as TableType]}
            />
          </div>
        )}
      </DealTableTemplate>
    </NotFoundByPosition>
  );
};

export default PersonDealsTable;
