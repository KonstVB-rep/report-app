import { flexRender, Header, Row } from "@tanstack/react-table";

import { UserTypeTable } from "@/entities/user/model/column-data-user";
import AccordionComponent from "@/shared/custom-components/ui/AccordionComponent";
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog";

import DialogDeleteUser from "../DialogDeleteUser";
import DialogEditUser from "../DialogEditUser";
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
            <RowInfoDialog
              isActive={true}
              text={flexRender(cell.column.columnDef.cell, cell.getContext())}
              closeFn={closeFn}
              isTargetCell={true}
            >
              <div className="flex flex-col gap-2 w-full">
                <AccordionComponent title="Удалить/Изменить пользователя">
                  <div className="flex gap-2">
                    <DialogEditUser
                      user={row.original}
                      textButtonShow={true}
                      className="flex-1"
                    />
                    <DialogDeleteUser
                      user={row.original}
                      textButtonShow={true}
                      className="flex-1"
                    />
                  </div>
                </AccordionComponent>
              </div>
            </RowInfoDialog>
          )}
        </UserTableCell>
      ))}
    </>
  );
};

export default UserTableCellContent;
