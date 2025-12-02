"use client"

import { type JSX, useMemo } from "react"
import { PermissionEnum } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import dynamic from "next/dynamic"
import z from "zod"
import Loading from "@/app/dashboard/summary-table/[departmentId]/[dealType]/[userId]/loading"
import { TableTypes } from "@/entities/deal/lib/constants"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import type { DealsUnionType, ProjectResponse, RetailResponse } from "@/entities/deal/types"
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate"
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable"
import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable"
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton"
import type { DepartmentsUnionIds } from "@/entities/department/types"
import { useGetAllDealsByType } from "@/feature/deals/api/hooks/query"
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"
import type { TypeBaseDT } from "@/shared/custom-components/ui/Table/model/types"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard"
import { columnsDataProjectForMarketing } from "@/widgets/deal/model/columns-data-project-for-marketing"
import { columnsDataRetailForMarketing } from "@/widgets/deal/model/columns-data-retail-for-marketing"
import DataTable from "@/widgets/DataTable/ui/DataTable"

const Columns = (
  type: DealsUnionType,
): ColumnDef<ProjectResponse, unknown>[] | ColumnDef<RetailResponse, unknown>[] => {
  switch (type) {
    case "projects":
      return columnsDataProjectForMarketing
    case "retails":
      return columnsDataRetailForMarketing
    default:
      throw new Error(`Unknown table type: ${type}`)
  }
}

const DealsTable = dynamic(() => import("@/widgets/deal/ui/DealsTable"), {
  ssr: false,
  loading: () => <TableRowsSkeleton />,
}) as <T extends { id: string }>(props: {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  hasEditDeleteActions: boolean
}) => JSX.Element

export interface SummaryTableProps<TData extends { id: string }> {
  columns: ColumnDef<TData, unknown>[]
}

const pageParamsSchema = z.object({
  // dealType: z.enum(TableTypes),
  userId: z.string(),
  departmentId: z.coerce
    .number()
    .positive()
    .transform((value) => {
      return value as DepartmentsUnionIds
    }),
})

const MarketingDealsTable = () => {
  const { userId, departmentId } = useTypedParams(pageParamsSchema)

  const hasAccess = useMemo(
    () =>
      userId ? hasAccessToDataSummary(userId as string, PermissionEnum.VIEW_UNION_REPORT) : false,
    [userId],
  )

  const {
    data: deals,
    error,
    isError,
    isPending,
  } = useGetAllDealsByType("projects", hasAccess ? userId : null, 1)

  console.log(deals, "deals")

  if (!hasAccess) {
    return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />
  }

  if (isPending) return <Loading />

  return (
    <DealTableTemplate>
      {isError && <ErrorMessageTable message={error?.message} />}
      {/* <div className="flex gap-2 flex-wrap">
        <LinkToUserTable />
        <p className="border rounded-md p-2">Количество заявок: {deals?.length}</p>
      </div> */}

      <DataTable
        columns={Columns("projects" as DealsUnionType) as ColumnDef<TypeBaseDT>[]}
        data={deals as TypeBaseDT[]}
        hasEditDeleteActions={false}
      />
    </DealTableTemplate>
  )
}

export default withAuthGuard(MarketingDealsTable)
