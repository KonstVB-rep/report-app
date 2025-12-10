"use client"

import { useMemo } from "react"
import { PermissionEnum } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import z from "zod"
import Loading from "@/app/dashboard/summary-table/[departmentId]/[dealType]/[userId]/loading"
import { TableTypes } from "@/entities/deal/lib/constants"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import type { DealsUnionType, ProjectResponse, RetailResponse } from "@/entities/deal/types"
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate"
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable"
import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable"
import type { DepartmentsUnionIds } from "@/entities/department/types"
import { useGetAllDealsByType } from "@/feature/deals/api/hooks/query"
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"
import type { TypeBaseDT } from "@/shared/custom-components/ui/Table/model/types"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import DealsTable from "@/widgets/deal/ui/DealsTable"
import { columnsDataProjectSummary } from "../model/summary-columns-data-project"
import { columnsDataRetailSummary } from "../model/summary-columns-data-retail"

const getColumns = (
  type: DealsUnionType,
): ColumnDef<ProjectResponse, unknown>[] | ColumnDef<RetailResponse, unknown>[] => {
  switch (type) {
    case "projects":
      return columnsDataProjectSummary
    case "retails":
      return columnsDataRetailSummary
    default:
      console.error(`Unknown table type: ${type}`)
      return []
  }
}

const HIDDEN_COLS = { id: false, user: false, resource: false }

const pageParamsSchema = z.object({
  dealType: z.enum(TableTypes),
  userId: z.string(),
  departmentId: z.coerce
    .number()
    .positive()
    .transform((value) => value as DepartmentsUnionIds),
})

const SummaryDealsTable = () => {
  const { userId, departmentId, dealType } = useTypedParams(pageParamsSchema)

  const hasAccess = useMemo(
    () => (userId ? hasAccessToDataSummary(userId, PermissionEnum.VIEW_UNION_REPORT) : false),
    [userId],
  )

  const columns = useMemo(() => getColumns(dealType as DealsUnionType), [dealType])

  const {
    data: deals,
    error,
    isError,
    isPending,
  } = useGetAllDealsByType(dealType, hasAccess ? userId : null, departmentId)

  if (!hasAccess) {
    return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />
  }

  if (isPending) return <Loading />

  return (
    <DealTableTemplate>
      {isError && <ErrorMessageTable message={error?.message} />}

      <div className="flex gap-2 flex-wrap">
        <LinkToUserTable />
        <p className="border rounded-md p-2">Количество заявок: {deals?.length ?? 0}</p>
      </div>

      <DealsTable
        columns={columns as ColumnDef<TypeBaseDT>[]}
        data={(deals as TypeBaseDT[]) || []} // Защита от undefined
        hasEditDeleteActions={false}
        hiddenCols={HIDDEN_COLS}
      />
    </DealTableTemplate>
  )
}

export default SummaryDealsTable
