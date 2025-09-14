"use client";

import {
  columnsDataUsers,
  UserTypeTable,
} from "@/entities/user/model/column-data-user";
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider";
import TableCaption from "@/shared/custom-components/ui/Table/TableCaption";
import { useTableState } from "@/shared/hooks/useTableState";

import { useGetAllUsers } from "../../hooks/query";
import UserTableContent from "./UserTableContent";
import UserTableToolbar from "./UserTableToolbar";

const UserTable = () => {
  const { data, isLoading } = useGetAllUsers();

  const users = data || [];

  const { table, filtersContextValue, setGlobalFilter } =
    useTableState<UserTypeTable>(users, columnsDataUsers);

  const { globalFilter, rowSelection } = table.getState();

  const usersSelected = table
    .getRowModel()
    .rows.filter((row) => rowSelection[row.id])
    .map((row) => row.original);

  return (
    <div>
      <TableCaption title="Список пользователей" />
      <DataTableFiltersProvider value={filtersContextValue}>
        <div className="py-2 grid gap-2">
          <UserTableToolbar
            globalFilter={globalFilter ?? ""}
            onGlobalFilterChange={(value) => setGlobalFilter(String(value))}
            rowSelection={usersSelected}
          />
          <UserTableContent table={table} isLoading={isLoading} />
        </div>
      </DataTableFiltersProvider>
    </div>
  );
};

export default UserTable;
