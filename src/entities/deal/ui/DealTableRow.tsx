import { useParams } from "next/navigation"
import BaseTableRow from "@/shared/custom-components/ui/Table/BaseTableRow"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
// import { getRowClassName } from "@/shared/custom-components/ui/Table/TableRowDealOrTask";
import { pageParamsSchemaDepsId, useTypedParams } from "@/shared/hooks/useTypedParams"
import { getRowClassName } from "@/shared/lib/helpers/getRowClassName"
import type { DealBase, DealTableRowProps } from "../types"

export const DealTableRow = <T extends DealBase>({
  row,
  virtualRow,
  headers,
  ...rest
}: DealTableRowProps<T>) => {
  // const { departmentId } = useTypedParams(pageParamsSchemaDepsId)

  const { departmentId } = useParams<{
    departmentId: string
  }>()

  const departmentIdNumber = Number(departmentId)
  const { getContextMenuActions, renderAdditionalInfo } = useTableContext<T>()

  const dealType = row.original.type?.toLowerCase()
  const path = `/dashboard/deal/${departmentIdNumber}/${dealType}/${row.original.id}`

  return (
    <BaseTableRow<T>
      {...rest}
      className={getRowClassName(row.original.dealStatus)}
      getContextMenuActions={getContextMenuActions}
      headers={headers}
      path={path}
      renderAdditionalInfo={(row) => renderAdditionalInfo?.(row.original.id)}
      row={row}
      virtualRow={virtualRow}
    />
  )
}
