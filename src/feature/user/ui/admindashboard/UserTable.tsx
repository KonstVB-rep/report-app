"use client"

import { columnsDataUsers, type UserTypeTable } from "@/entities/user/model/column-data-user"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider"
import DrawerComponent from "@/shared/custom-components/ui/DrawerComponent"
import TableCaption from "@/shared/custom-components/ui/Table/TableCaption"
import { useTableState } from "@/shared/hooks/useTableState"
import { useGetAllUsers } from "../../hooks/query"
import UserActionsBlock from "./UserActionsBlock"
import UserTableContent from "./UserTableContent"
import UserTableToolbar from "./UserTableToolbar"

const hiddenColumns = {
  id: false,
}

const UserTable = () => {
  const authUser = useStoreUser((state) => state.authUser)
  const { data, isLoading } = useGetAllUsers()

  console.log(data, "data")

  const users = data || []

  const { table, filtersContextValue, setGlobalFilter } = useTableState<UserTypeTable>(
    users,
    columnsDataUsers,
    { hiddenColumns },
  )

  const { globalFilter, rowSelection } = table.getState()

  const usersSelected = table
    .getRowModel()
    .rows.filter((row) => rowSelection[row.id])
    .map((row) => row.original)

  if (!authUser) {
    return <h1 className="text-2xl p-2 text-center">Пользователь не авторизован</h1>
  }

  return (
    <>
      <TableCaption title="Список пользователей" />
      <DataTableFiltersProvider value={filtersContextValue}>
        <div className="py-2 grid gap-2">
          <UserTableToolbar
            globalFilter={globalFilter ?? ""}
            onGlobalFilterChange={(value) => setGlobalFilter(String(value))}
            // rowSelection={usersSelected}
          />
          <UserTableContent isLoading={isLoading} table={table} />
        </div>
      </DataTableFiltersProvider>
      <DrawerComponent positionSide="bottom-2">
        <UserActionsBlock rowSelection={usersSelected} />
      </DrawerComponent>
    </>
  )
}

export default UserTable
