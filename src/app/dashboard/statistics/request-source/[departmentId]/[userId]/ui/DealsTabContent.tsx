import type { ColumnDef, Row } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import type { ProjectResponse, RetailResponse } from "@/entities/deal/types"
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate"
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable"
import type { DepartmentsUnionIds } from "@/entities/department/types"
import { useGetAllDealsByType } from "@/feature/deals/api/hooks/query"
import type { TypeBaseDT } from "@/shared/custom-components/ui/Table/model/types"
import TableRowsWrapper from "@/shared/custom-components/ui/Table/TableRowsWrapper"
import TableWithoutContent from "@/shared/custom-components/ui/Table/TableWithoutContent"
import DataTable from "@/widgets/DataTable/ui/DataTable"
import Loading from "../loading"

type HiddenColumns = Record<string, boolean>
type DealsTabContentProps =
  | {
      dealType: "retails"
      columns: ColumnDef<RetailResponse, unknown>[]
      hiddenColumns: HiddenColumns
      userId: string | null
      departmentId: DepartmentsUnionIds
      hasAccess: boolean
    }
  | {
      dealType: "projects"
      columns: ColumnDef<ProjectResponse, unknown>[]
      hiddenColumns: HiddenColumns
      userId: string | null
      departmentId: DepartmentsUnionIds
      hasAccess: boolean
    }

const DealsTabContent = (props: DealsTabContentProps) => {
  const { dealType, columns, hiddenColumns, userId, departmentId, hasAccess } = props

  const {
    data: deals,
    error,
    isError,
    isPending,
  } = useGetAllDealsByType(dealType, hasAccess ? userId : null, departmentId)

  if (isPending) return <Loading />
  if (isError) return <ErrorMessageTable message={error?.message} />

  return (
    <DealTableTemplate>
      <DataTable
        columns={columns as ColumnDef<TypeBaseDT>[]}
        data={deals as TypeBaseDT[]}
        dealType={dealType}
        hasEditDeleteActions={false}
        hiddenColumns={hiddenColumns}
        rowData={({ table, openFilters, hasEditDeleteActions }) => (
          <TableRowsWrapper
            openFilters={openFilters}
            renderVirtualRow={({
              row,
              virtualRow,
            }: {
              row: Row<TypeBaseDT>
              virtualRow: VirtualItem
            }) => (
              <TableWithoutContent<TypeBaseDT>
                entityType={"deal"}
                hasEditDeleteActions={hasEditDeleteActions}
                headers={table.getHeaderGroups()[0].headers}
                key={row.id}
                row={row}
                virtualRow={virtualRow}
              />
            )}
            table={table}
          />
        )}
      />
    </DealTableTemplate>
  )
}

export default DealsTabContent
