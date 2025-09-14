import { Cell } from "@tanstack/react-table";

import React, { CSSProperties } from "react";

import { UserTypeTable } from "@/entities/user/model/column-data-user";
import TableCellComponent from "@/shared/custom-components/ui/Table/TableCellCompoment";

interface UserTableCellProps {
  cell: Cell<UserTypeTable, unknown>;
  children?: (setShow: () => void) => React.ReactNode;
  styles?: CSSProperties;
}

const UserTableCell = ({ cell, children, styles }: UserTableCellProps) => {
  const [show, setShow] = React.useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <TableCellComponent<UserTypeTable>
      key={cell.id}
      styles={styles}
      cell={cell}
      handleOpenInfo={handleClick}
    >
      {show && children?.(() => setShow(false))}
    </TableCellComponent>
  );
};

export default UserTableCell;
