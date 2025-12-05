import { ProjectResponse, RetailResponse } from "@/entities/deal/types"
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate"
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable"
import { DepartmentsUnionIds } from "@/entities/department/types"
import { useGetAllDealsByType } from "@/feature/deals/api/hooks/query"
import { TypeBaseDT } from "@/shared/custom-components/ui/Table/model/types"
import TableRowsWrapper from "@/shared/custom-components/ui/Table/TableRowsWrapper"
import TableWithoutContent from "@/shared/custom-components/ui/Table/TableWithoutContent"
import DataTable from "@/widgets/DataTable/ui/DataTable"
import { ColumnDef, Row } from "@tanstack/react-table"
import { VirtualItem } from "@tanstack/react-virtual"
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
        hasEditDeleteActions={false}
        hiddenColumns={hiddenColumns}
        dealType={dealType}
        rowData={({ table, openFilters, hasEditDeleteActions }) => (
          <TableRowsWrapper
            table={table}
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
          />
        )}
      />
    </DealTableTemplate>
  )
}

export default DealsTabContent
