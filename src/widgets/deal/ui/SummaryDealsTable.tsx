"use client"

import { useMemo } from "react"
import { PermissionEnum } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { useParams } from "next/navigation"
import Loading from "@/app/dashboard/summary-table/[departmentId]/[dealType]/[userId]/loading"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import type {
  DealsUnionType,
  DealUnion,
  ProjectResponse,
  RetailResponse,
} from "@/entities/deal/types"
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate"
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable"
import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable"
import { useGetAllDealsByType } from "@/feature/deals/api/hooks/query"
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"
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
      return []
  }
}

const HIDDEN_COLS = { id: false, resource: false }

const SummaryDealsTable = () => {
  const {
    departmentId: depNum,
    userId,
    dealType,
  } = useParams<{
    departmentId: string
    userId: string
    dealType: DealsUnionType
  }>()

  const departmentId = Number(depNum)

  const hasAccess = useMemo(
    () => (userId ? hasAccessToDataSummary(userId, PermissionEnum.VIEW_UNION_REPORT) : false),
    [userId],
  )

  const columns = useMemo(() => getColumns(dealType), [dealType])

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
        columns={columns as ColumnDef<DealUnion>[]}
        data={(deals as DealUnion[]) || []} // Защита от undefined
        hasEditDeleteActions={false}
        hiddenCols={HIDDEN_COLS}
      />
    </DealTableTemplate>
  )
}

export default SummaryDealsTable
