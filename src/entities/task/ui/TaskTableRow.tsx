import { useParams } from "next/navigation"
import type { TaskWithUserInfo } from "@/entities/task/types"
import type { TaskTableRowProps } from "@/entities/tgBot/types"
import BaseTableRow from "@/shared/custom-components/ui/Table/BaseTableRow"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"

const TaskTableRow = <T extends TaskWithUserInfo>({
  row,
  virtualRow,
  headers,
}: TaskTableRowProps<T>) => {
  const { departmentId } = useParams<{
    departmentId: string
  }>()

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

export default TaskTableRow
