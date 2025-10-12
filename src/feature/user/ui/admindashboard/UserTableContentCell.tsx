import { flexRender, type Header, type Row } from "@tanstack/react-table"
import type { UserTypeTable } from "@/entities/user/model/column-data-user"
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog"
import UserTableCell from "./UserTableCell"

interface UserTableCellContentProps {
  row: Row<UserTypeTable>
  headers: Header<UserTypeTable, unknown>[]
}

const UserTableCellContent = ({ row, headers }: UserTableCellContentProps) => {
  return (
    <>
      {row.getVisibleCells().map((cell, index) => (
        <UserTableCell
          cell={cell}
          key={cell.id}
          styles={{
            padding: "0.5rem",
            position: "relative",
            width: headers?.[index]?.getSize(),
            minWidth: headers?.[index]?.column.columnDef.minSize,
            maxWidth: headers?.[index]?.column.columnDef.maxSize,
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
      ))}
    </>
  )
}

export default UserTableCellContent
