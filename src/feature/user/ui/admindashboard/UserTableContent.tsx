import { Table } from "@tanstack/react-table";
import { UserTypeTable } from "@/entities/user/model/column-data-user";
import { SkeletonTable } from "@/shared/custom-components/ui/Skeletons/SkeletonTable";
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate";
import UserTableCellContent from "./UserTableContentCell";
import { TableRow } from "@/shared/components/ui/table";

interface UserTableContentProps {
  table: Table<UserTypeTable>;
  isLoading: boolean;
}

const UserTableContent = ({ table, isLoading }: UserTableContentProps) => {
  const headers = table.getHeaderGroups()[0].headers;
  
  return (
    <TableTemplate table={table} className="overflow-auto">
      {isLoading ? (
        <SkeletonTable className="p-1" />
      ) : (
        table
          .getRowModel()
          .rows.map((row) => (
          <TableRow key={row.id} className="flex">
            <UserTableCellContent row={row} headers={headers} />
          </TableRow>
          ))
      )}
    </TableTemplate>
  );
};

export default UserTableContent;