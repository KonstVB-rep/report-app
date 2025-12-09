"use client"

import { PermissionEnum } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import z from "zod"
import { UnionDealTypeParams } from "@/entities/deal/lib/constants"
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData"
import type { ProjectResponse, RetailResponse, TableType } from "@/entities/deal/types"
import ButtonsGroupTable from "@/entities/deal/ui/ButtonsGroupTable"
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate"
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton"
import { useDealsUser } from "@/feature/deals/api/hooks/query"
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"
import NotFoundByPosition from "@/shared/custom-components/ui/Redirect/NotFoundByPosition"
import type { TypeBaseDT } from "@/shared/custom-components/ui/Table/model/types"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import { columnsDataContract } from "../model/columns-data-contracts"
import { columnsDataProject } from "../model/columns-data-project"
import { columnsDataRetail } from "../model/columns-data-retail"
import DealsTable from "./DealsTable"

export const DealTypeLabels: Record<string, string> = {
  projects: "Проекты",
  retails: "Розничные сделки",
  contracts: "Договора",
  orders: "Заявки",
}

// const DealsTable = dynamic(() => import("@/widgets/deal/ui/DealsTable"), {
//   ssr: false,
//   loading: () => <TableRowsSkeleton />,
// })

const Columns = (
  type: TableType,
):
  | ColumnDef<ProjectResponse, unknown>[]
  | ColumnDef<RetailResponse, unknown>[]
  | ColumnDef<ProjectResponse, unknown>[] => {
  switch (type) {
    case "projects":
      return columnsDataProject
    case "retails":
      return columnsDataRetail
    case "contracts":
      return columnsDataContract
    default:
      return []
  }
}

type HiddenColumns = Record<string, boolean>

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
}

const pageParamsSchema = z.object({
  userId: z.string(),
  dealType: z.enum(UnionDealTypeParams),
})

const PersonDealsTable = () => {
  const { userId, dealType } = useTypedParams(pageParamsSchema)

  const hasAccess = hasAccessToData(userId as string, PermissionEnum.VIEW_USER_REPORT)

  const { data = [], isLoading } = useDealsUser(
    dealType as TableType,
    hasAccess ? (userId as string) : undefined,
  )

  if (!hasAccess)
    return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />

  return (
    <NotFoundByPosition>
      <DealTableTemplate>
        <div className="flex flex-wrap justify-between gap-3 w-full">
          <h1 className="text-lg uppercase flex-1 p-2 bg-muted rounded-md font-semibold">
            {DealTypeLabels[dealType as string]}
          </h1>
          <p className="border rounded-md p-2">Количество заявок: {data?.length}</p>
        </div>

        <ButtonsGroupTable />
        {isLoading ? (
          <TableRowsSkeleton />
        ) : (
          <DealsTable
            columns={Columns(dealType as TableType) as ColumnDef<TypeBaseDT>[]}
            data={data as TypeBaseDT[]}
            hiddenCols={hiddenDefCols[dealType as TableType]}
          />
        )}
      </DealTableTemplate>
    </NotFoundByPosition>
  )
}

export default PersonDealsTable
