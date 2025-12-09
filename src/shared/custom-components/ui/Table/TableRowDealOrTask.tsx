import React, { useMemo } from "react"
import type { DealType } from "@prisma/client"
import { flexRender, type Header, type Row } from "@tanstack/react-table"
import { TableRow } from "@/shared/components/ui/table"
import { pageParamsSchemaDepsId, useTypedParams } from "@/shared/hooks/useTypedParams"
import ContextRowTable from "../ContextRowTable"
import { useTableContext } from "./context/TableContext"
import RowInfoDialog from "./RowInfoDialog"
import TableCellComponent from "./TableCellCompoment"

export const getRowClassName = (dealStatus?: string) => {
  const baseClass = "tr hover:bg-zinc-600 hover:text-white relative flex"
  if (!dealStatus) return baseClass

  const statusMap: Record<string, string> = {
    CLOSED: "bg-green-950/50 darK:bg-green-950/30 dark:opacity-60",
    REJECT: "bg-red-900/40 dark:bg-red-900/40 opacity-80 dark:opacity-60",
    PAID: "bg-green-100 dark:bg-lime-200/20",
  }

  return `${baseClass} ${statusMap[dealStatus] || ""}`
}

type TableRowDealOrTaskProps<T extends Record<string, unknown>> = {
  row: Row<T>
  virtualRow: { index: number; start: number }
  headers?: Header<T, unknown>[]
  hasEditDeleteActions?: boolean
  entityType: "deal" | "task"
}

const TableRowDealOrTask = <T extends Record<string, unknown>>({
  row,
  virtualRow,
  headers,
  hasEditDeleteActions,
  entityType,
}: TableRowDealOrTaskProps<T>) => {
  const [openFullInfoCell, setOpenFullInfoCell] = React.useState<string | null>(null)
  const { departmentId } = useTypedParams(pageParamsSchemaDepsId)

  const { getContextMenuActions, renderAdditionalInfo } = useTableContext<T>()

  const handleOpenInfo = React.useCallback((cellId: string) => {
    setOpenFullInfoCell((prev) => (prev === cellId ? null : cellId))
  }, [])

  const linkPath = useMemo(() => {
    if (entityType === "deal") {
      return row.original.type
        ? `/dashboard/deal/${departmentId}/${(row.original.type as DealType).toLowerCase()}/${row.original.id}`
        : undefined
    }
    return `/dashboard/tasks/${departmentId}/${row.original.assignerId}/${row.original.id}/`
  }, [entityType, departmentId, row.original])

  const rowClasses = useMemo(() => {
    if (entityType === "deal") {
      return getRowClassName(row.original.dealStatus as string)
    }
    return "tr hover:bg-zinc-600 hover:text-white relative flex"
  }, [entityType, row.original.dealStatus])

  return (
    <ContextRowTable
      hasEditDeleteActions={hasEditDeleteActions}
      modals={
        getContextMenuActions
          ? (setOpenModal) => getContextMenuActions(setOpenModal, row)
          : undefined
      }
      path={linkPath}
    >
      <TableRow
        className={rowClasses}
        data-closed={entityType === "deal" && row.original.dealStatus === "CLOSED"}
        data-reject={entityType === "deal" && row.original.dealStatus === "REJECT"}
        data-success={entityType === "deal" && row.original.dealStatus === "PAID"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          transform: `translateY(${virtualRow.start}px)`,
        }}
      >
        {row.getVisibleCells().map((cell, index) => (
          <TableCellComponent<T>
            cell={cell}
            handleOpenInfo={handleOpenInfo}
            key={cell.id}
            styles={{
              width: headers?.[index]?.getSize(),
              minWidth: headers?.[index]?.column.columnDef.minSize,
              maxWidth: headers?.[index]?.column.columnDef.maxSize,
            }}
          >
            {openFullInfoCell === cell.id && (
              <RowInfoDialog
                closeFn={() => setOpenFullInfoCell(null)}
                isActive={true}
                isTargetCell={entityType === "deal" && cell.column.id === "contact"}
                text={
                  entityType === "deal" && cell.column.id === "contact"
                    ? undefined
                    : flexRender(cell.column.columnDef.cell, cell.getContext())
                }
              >
                {entityType === "deal" && renderAdditionalInfo?.(row.original.id as string)}
              </RowInfoDialog>
            )}
          </TableCellComponent>
        ))}
      </TableRow>
    </ContextRowTable>
  )
}

export default React.memo(TableRowDealOrTask, (prev, next) => {
  return (
    prev.row.original === next.row.original &&
    prev.virtualRow.start === next.virtualRow.start &&
    prev.entityType === next.entityType
  )
}) as typeof TableRowDealOrTask
