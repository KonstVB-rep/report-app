import type { UserTypeTable } from "@/entities/user/model/column-data-user"
import DialogAddUser from "../DialogAddUser"
import DialogDeleteUser from "../DialogDeleteUser"
import DialogDeleteUsersList from "../DialogDeleteUsersList"
import DialogEditUser from "../DialogEditUser"

const UserActionsBlock = ({ rowSelection }: { rowSelection: UserTypeTable[] }) => {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div className="flex gap-1">
        {rowSelection.length === 1 && (
          <DialogEditUser className="w-fit" textButtonShow={true} user={rowSelection[0]} />
        )}
        {rowSelection.length === 1 && (
          <DialogDeleteUser
            className="w-fit text-white"
            textButtonShow={true}
            user={rowSelection[0]}
          />
        )}
        {rowSelection.length > 1 && (
          <DialogDeleteUsersList
            className="w-fit text-white"
            textButtonShow={true}
            users={rowSelection}
          />
        )}
      </div>
      <DialogAddUser className="text-sm justify-start w-fit" />
    </div>
  )
}

export default UserActionsBlock
