import { Role } from "@prisma/client"
import { useParams } from "next/navigation"
import type { TaskWithUserInfo } from "@/entities/task/types"
import type { TaskTableRowProps } from "@/entities/tgBot/types"
import BaseTableRow from "@/shared/custom-components/ui/Table/BaseTableRow"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"

const TaskTableRow = <T extends TaskWithUserInfo>({
  row,
  virtualRow,
  headers,
}: TaskTableRowProps<T>) => {
  const authUser = useRequireAuth()
  const { departmentId } = useParams<{
    departmentId: string
  }>()

  const { getContextMenuActions } = useTableContext<T>()

  const path = `/dashboard/tasks/${departmentId}/${row.original.assignerId}/${row.original.id}/`

  const ADMIN_ROLES: Set<Role> = new Set([Role.ADMIN, Role.SUPER_ADMIN])

  const isCanActionTask =
    row.original.assignerId === authUser.id ||
    row.original.executorId === authUser.id ||
    ADMIN_ROLES.has(authUser.role)

  return (
    <BaseTableRow<T>
      className="tr hover:bg-zinc-600"
      getContextMenuActions={getContextMenuActions}
      hasEditDeleteActions={isCanActionTask}
      headers={headers}
      path={path}
      row={row}
      virtualRow={virtualRow}
    />
  )
}

export default TaskTableRow
