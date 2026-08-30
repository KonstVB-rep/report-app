"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { useParams } from "next/navigation"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import type { DealsUnionType, ProjectResponse, RetailResponse } from "@/entities/deal/types"
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate"
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable"
import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable"
import DealsSkeleton from "@/entities/deal/ui/Skeletons/DealsSkeleton"
import { useGetAllDealsByType } from "@/feature/deals/api/hooks/query"
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"
import { PERMISSIONS } from "@/shared/lib/constants"
import DealsTable from "@/widgets/deal/ui/DealsTable"
import { columnsDataProjectSummary } from "../model/summary-columns-data-project"
import { columnsDataRetailSummary } from "../model/summary-columns-data-retail"

type SummaryColumns = ColumnDef<ProjectResponse>[] | ColumnDef<RetailResponse>[]

type PageDealType = ProjectResponse | RetailResponse

const getColumns = (type: DealsUnionType | undefined): SummaryColumns => {
  switch (type) {
    case "projects":
      return columnsDataProjectSummary
    case "retails":
      return columnsDataRetailSummary
    default:
      return []
  }
}

const HIDDEN_COLS = { id: false, resource: false, rowNumber: false } as const

const SummaryDealsTable = () => {
  const params = useParams<{
    departmentId: string
    userId: string
    dealType: DealsUnionType
  }>()

  const { departmentId: depNum, userId, dealType } = params

  const departmentId = Number(depNum)

  const hasAccess = useMemo(
    () => (userId ? hasAccessToDataSummary(userId, PERMISSIONS.VIEW_UNION_REPORT) : false),
    [userId],
  )

  const columns = useMemo(() => getColumns(dealType), [dealType])

  const {
    data: deals,
    error,
    isError,
    isLoading,
  } = useGetAllDealsByType(dealType, hasAccess ? userId : null, departmentId)

  if (Number.isNaN(departmentId)) {
    return <AccessDeniedMessage error={{ message: "Некорректный идентификатор отдела" }} />
  }

  if (!hasAccess) {
    return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />
  }

  if (isLoading) {
    return <DealsSkeleton />
  }

  const typedDeals = (deals ?? []) as PageDealType[]

  const dealsCount = deals?.length ?? 0

  return (
    <DealTableTemplate>
      {isError && <ErrorMessageTable message={error?.message} />}

      <div className="flex gap-2 flex-wrap">
        <LinkToUserTable />
        <p className="border rounded-md p-2">Количество заявок: {dealsCount}</p>
      </div>

      <DealsTable<PageDealType>
        columns={columns as ColumnDef<PageDealType>[]}
        data={typedDeals}
        hasEditDeleteActions={false}
        hiddenCols={HIDDEN_COLS}
        tableName="summary-table"
      />
    </DealTableTemplate>
  )
}

export default SummaryDealsTable
