// "use client"

// import Loading from "@/app/dashboard/summary-table/[departmentId]/[dealType]/[userId]/loading"
// import { TableTypes } from "@/entities/deal/lib/constants"
// import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
// import type { DealsUnionType, ProjectResponse, RetailResponse } from "@/entities/deal/types"
// import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate"
// import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable"
// import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable"
// import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton"
// import type { DepartmentsUnionIds } from "@/entities/department/types"
// import { useGetAllDealsByType } from "@/feature/deals/api/hooks/query"
// import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"
// import type { TypeBaseDT } from "@/shared/custom-components/ui/Table/model/types"
// import { useTypedParams } from "@/shared/hooks/useTypedParams"
// import withAuthGuard from "@/shared/lib/hoc/withAuthGuard"
// import { PermissionEnum } from "@prisma/client"
// import type { ColumnDef } from "@tanstack/react-table"
// import dynamic from "next/dynamic"
// import { type JSX, useMemo } from "react"
// import z from "zod"
// import { columnsDataProjectSummary } from "../model/summary-columns-data-project"
// import { columnsDataRetailSummary } from "../model/summary-columns-data-retail"

// const Columns = (
//   type: DealsUnionType,
// ): ColumnDef<ProjectResponse, unknown>[] | ColumnDef<RetailResponse, unknown>[] => {
//   switch (type) {
//     case "projects":
//       return columnsDataProjectSummary
//     case "retails":
//       return columnsDataRetailSummary
//     default:
//       throw new Error(`Unknown table type: ${type}`)
//   }
// }

// const hiddenCols = { id: false, user: false, resource: false }

// const DealsTable = dynamic(() => import("@/widgets/deal/ui/DealsTable"), {
//   ssr: false,
//   loading: () => <TableRowsSkeleton />,
// }) as <T extends { id: string }>(props: {
//   columns: ColumnDef<T, unknown>[]
//   data: T[]
//   hasEditDeleteActions: boolean,
//   hiddenCols: Partial<
//     Record<Extract<NonNullable<ColumnDef<T>["id"]>, string>, boolean>
//   >
// }) => JSX.Element

// export interface SummaryTableProps<TData extends { id: string }> {
//   columns: ColumnDef<TData, unknown>[]
// }

// const pageParamsSchema = z.object({
//   dealType: z.enum(TableTypes),
//   userId: z.string(),
//   departmentId: z.coerce
//     .number()
//     .positive()
//     .transform((value) => {
//       return value as DepartmentsUnionIds
//     }),
// })

// const SummaryDealsTable = () => {
//   const { userId, departmentId, dealType } = useTypedParams(pageParamsSchema)

//   const hasAccess = useMemo(
//     () =>
//       userId ? hasAccessToDataSummary(userId as string, PermissionEnum.VIEW_UNION_REPORT) : false,
//     [userId],
//   )

//   const {
//     data: deals,
//     error,
//     isError,
//     isPending,
//   } = useGetAllDealsByType(dealType, hasAccess ? userId : null, departmentId)

//   if (!hasAccess) {
//     return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />
//   }

//   if (isPending) return <Loading />

//   return (
//     <DealTableTemplate>
//       {isError && <ErrorMessageTable message={error?.message} />}
//       <div className="flex gap-2 flex-wrap">
//         <LinkToUserTable />
//         <p className="border rounded-md p-2">Количество заявок: {deals?.length}</p>
//       </div>
//       <DealsTable
//         columns={Columns(dealType as DealsUnionType) as ColumnDef<TypeBaseDT>[]}
//         data={deals as TypeBaseDT[]}
//         hasEditDeleteActions={false}
//         hiddenCols={hiddenCols}
//       />
//     </DealTableTemplate>
//   )
// }

// export default withAuthGuard(SummaryDealsTable)
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
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard"
// Убрали dynamic import, чтобы таблица рендерилась сразу (Hydration)
// Если DealsTable ОЧЕНЬ тяжелый, можно вернуть dynamic, но убрать ssr: false
import DealsTable from "@/widgets/deal/ui/DealsTable"
import { columnsDataProjectSummary } from "../model/summary-columns-data-project"
import { columnsDataRetailSummary } from "../model/summary-columns-data-retail"

// 1. Вынесли функцию получения колонок из компонента (чистая функция)
const getColumns = (
  type: DealsUnionType,
): ColumnDef<ProjectResponse, unknown>[] | ColumnDef<RetailResponse, unknown>[] => {
  switch (type) {
    case "projects":
      return columnsDataProjectSummary
    case "retails":
      return columnsDataRetailSummary
    default:
      // Лучше вернуть пустой массив или лог, чем крашить приложение ошибкой
      console.error(`Unknown table type: ${type}`)
      return []
  }
}

// Вынесли статичный объект, чтобы не пересоздавать его
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

  // 2. Оптимизировали проверку доступа
  const hasAccess = useMemo(
    () => (userId ? hasAccessToDataSummary(userId, PermissionEnum.VIEW_UNION_REPORT) : false),
    [userId],
  )

  // 3. Мемоизация колонок.
  // Критично для TanStack Table: стабильная ссылка предотвращает лишние ре-рендеры.
  const columns = useMemo(() => getColumns(dealType as DealsUnionType), [dealType])

  const {
    data: deals,
    error,
    isError,
    isPending,
    // isFetching // можно использовать для индикатора фонового обновления
  } = useGetAllDealsByType(dealType, hasAccess ? userId : null, departmentId)

  if (!hasAccess) {
    return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />
  }

  // 4. Логика загрузки
  // Если вы сделали prefetch на сервере (HydrationBoundary), isPending будет false сразу же.
  // Если нет - покажется Loading.
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

export default withAuthGuard(SummaryDealsTable)
