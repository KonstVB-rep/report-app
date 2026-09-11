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
  const rows = table.getRowModel().rows
  return (
    <TableTemplate className="overflow-auto" table={table}>
      {!isLoading && rows.length === 0 && (
        <TableRow className="flex items-center h-full justify-center">Нет данных</TableRow>
      )}
      {isLoading ? (
        <SkeletonTable className="p-1" />
      ) : (
        rows.map((row) => (
          <TableRow className="flex" key={row.id}>
            <UserTableCellContent row={row} />
          </TableRow>
        ))
      )}
    </TableTemplate>
  )
}

export default UserTableContent
