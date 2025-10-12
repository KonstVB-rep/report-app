import React, { type CSSProperties } from "react"
import type { Cell } from "@tanstack/react-table"
import type { UserTypeTable } from "@/entities/user/model/column-data-user"
import TableCellComponent from "@/shared/custom-components/ui/Table/TableCellCompoment"

interface UserTableCellProps {
  cell: Cell<UserTypeTable, unknown>
  children?: (setShow: () => void) => React.ReactNode
  styles?: CSSProperties
}

const UserTableCell = ({ cell, children, styles }: UserTableCellProps) => {
  const [show, setShow] = React.useState(false)

  const handleClick = () => {
    setShow(!show)
  }

  return (
    <TableCellComponent<UserTypeTable>
      cell={cell}
      handleOpenInfo={handleClick}
      key={cell.id}
      styles={styles}
    >
      {show && children?.(() => setShow(false))}
    </TableCellComponent>
  )
}

export default UserTableCell
