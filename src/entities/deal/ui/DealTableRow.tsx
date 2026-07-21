import { useParams } from "next/navigation"
import BaseTableRow from "@/shared/custom-components/ui/Table/BaseTableRow"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import { getRowClassName } from "@/shared/lib/helpers/getRowClassName"
import type { DealTableRowProps, DealUnion } from "../types"

export const DealTableRow = <T extends DealUnion>({
  row,
  virtualRow,
  ...rest
}: DealTableRowProps<T>) => {
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
      path={path}
      renderAdditionalInfo={(row) => renderAdditionalInfo?.(row.original.id)}
      row={row}
      virtualRow={virtualRow}
    />
  )
}
