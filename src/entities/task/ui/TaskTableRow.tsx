import { Role } from "@prisma/client"
import type { TaskWithUserInfo } from "@/entities/task/types"
import type { TaskTableRowProps } from "@/entities/tgBot/types"
import BaseTableRow from "@/shared/custom-components/ui/Table/BaseTableRow"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"

const TaskTableRow = <T extends TaskWithUserInfo>({ row, virtualRow }: TaskTableRowProps<T>) => {
  const authUser = useRequireAuth()

  const { getContextMenuActions } = useTableContext<T>()

  const ADMIN_ROLES: Set<Role> = new Set([Role.ADMIN, Role.SUPER_ADMIN])

  const isCanActionTask =
    row.original.assignerId === authUser.id ||
    row.original.executorId === authUser.id ||
    ADMIN_ROLES.has(authUser.role)

  return (
    <BaseTableRow.Task<T>
      className="tr hover:bg-zinc-300 dark:hover:bg-zinc-800"
      getContextMenuActions={getContextMenuActions}
      hasEditDeleteActions={isCanActionTask}
      row={row}
      virtualRow={virtualRow}
    />
  )
}

export default TaskTableRow
