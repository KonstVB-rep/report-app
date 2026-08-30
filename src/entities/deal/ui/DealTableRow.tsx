import { useParams } from "next/navigation"
import type { BaseDeal } from "@/entities/deal/types"
import BaseTableRow from "@/shared/custom-components/ui/Table/BaseTableRow"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import type { SharedTableRowProps } from "@/shared/custom-components/ui/Table/model/types"
import { getRowClassName } from "@/shared/lib/helpers/getRowClassName"

export type DealTableRowProps<T extends BaseDeal> = SharedTableRowProps<T>

// МЕНЯЕМ DealUnion на BaseDeal
export const DealTableRow = <T extends BaseDeal>({
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
