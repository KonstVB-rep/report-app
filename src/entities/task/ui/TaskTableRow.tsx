import type { TaskWithUserInfo } from "@/entities/task/types"
import type { TaskTableRowProps } from "@/entities/tgBot/types"
import BaseTableRow from "@/shared/custom-components/ui/Table/BaseTableRow"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import { pageParamsSchemaDepsId, useTypedParams } from "@/shared/hooks/useTypedParams"
import { memo } from "react"

const TaskTableRow = <T extends TaskWithUserInfo>({
  row,
  virtualRow,
  headers,
}: TaskTableRowProps<T>) => {
  const { departmentId } = useTypedParams(pageParamsSchemaDepsId)

  const { getContextMenuActions } = useTableContext<T>()

  const path = `/dashboard/tasks/${departmentId}/${row.original.assignerId}/${row.original.id}/`

  return (
    <BaseTableRow<T>
      className="tr hover:bg-zinc-600"
      getContextMenuActions={getContextMenuActions}
      headers={headers}
      path={path}
      row={row}
      virtualRow={virtualRow}
    />
  )
}

export default memo(TaskTableRow)
