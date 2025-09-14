import { flexRender, Header, Row } from "@tanstack/react-table";

import { UserTypeTable } from "@/entities/user/model/column-data-user";
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog";

import UserTableCell from "./UserTableCell";

interface UserTableCellContentProps {
  row: Row<UserTypeTable>;
  headers: Header<UserTypeTable, unknown>[];
}

const UserTableCellContent = ({ row, headers }: UserTableCellContentProps) => {
  return (
    <>
      {row.getVisibleCells().map((cell, index) => (
        <UserTableCell
          key={cell.id}
          cell={cell}
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
                isActive={true}
                text={flexRender(cell.column.columnDef.cell, cell.getContext())}
                closeFn={closeFn}
                isTargetCell={true}
              />
            </>
          )}
        </UserTableCell>
      ))}
    </>
  );
};

export default UserTableCellContent;
