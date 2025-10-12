import type { Table } from "@tanstack/react-table"
import type { UserTypeTable } from "@/entities/user/model/column-data-user"
import { TableRow } from "@/shared/components/ui/table"
import { SkeletonTable } from "@/shared/custom-components/ui/Skeletons/SkeletonTable"
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate"
import UserTableCellContent from "./UserTableContentCell"

interface UserTableContentProps {
  table: Table<UserTypeTable>
  isLoading: boolean
}

const UserTableContent = ({ table, isLoading }: UserTableContentProps) => {
  const headers = table.getHeaderGroups()[0].headers

  return (
    <TableTemplate className="overflow-auto" table={table}>
      {isLoading ? (
        <SkeletonTable className="p-1" />
      ) : (
        table.getRowModel().rows.map((row) => (
          <TableRow className="flex" key={row.id}>
            <UserTableCellContent headers={headers} row={row} />
          </TableRow>
        ))
      )}
    </TableTemplate>
  )
}

export default UserTableContent
