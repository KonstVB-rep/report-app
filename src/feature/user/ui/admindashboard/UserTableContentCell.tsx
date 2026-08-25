import { flexRender, type Header, type Row } from "@tanstack/react-table"
import type { UserTypeTable } from "@/entities/user/model/column-data-user"
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog"
import UserTableCell from "./UserTableCell"
import { NOT_GROW_COLS } from "@/shared/lib/constants"

interface UserTableCellContentProps {
  row: Row<UserTypeTable>
  headers: Header<UserTypeTable, unknown>[]
}

const UserTableCellContent = ({ row, headers }: UserTableCellContentProps) => {
  return (
    <>
      {row.getVisibleCells().map((cell) => {
        const columnId = cell.column.id

        const isNotGrow = NOT_GROW_COLS.includes(columnId)
        const flexValue = isNotGrow ? "0 0 auto" : "1 0 auto"

        if (cell.column.columnDef?.meta?.hidden) return null

        return (
          <UserTableCell
            cell={cell}
            key={cell.id}
            styles={{
              padding: "0.5rem",
              position: "relative",
              width: cell.column.getSize(),
              minWidth: cell.column.columnDef.minSize || 60,
              flex: flexValue,
            }}
          >
            {(closeFn) => (
              <>
                <RowInfoDialog
                  closeFn={closeFn}
                  isActive={true}
                  isTargetCell={true}
                  text={flexRender(cell.column.columnDef.cell, cell.getContext())}
                />
              </>
            )}
          </UserTableCell>
        )
      })}
    </>
  )
}

export default UserTableCellContent
