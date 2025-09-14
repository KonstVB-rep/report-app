import React from "react";

import { UserTypeTable } from "@/entities/user/model/column-data-user";

import DialogAddUser from "../DialogAddUser";
import DialogDeleteUser from "../DialogDeleteUser";
import DialogDeleteUsersList from "../DialogDeleteUsersList";
import DialogEditUser from "../DialogEditUser";

const UserActionsBlock = ({
  rowSelection,
}: {
  rowSelection: UserTypeTable[];
}) => {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div className="flex gap-1">
        {rowSelection.length === 1 && (
          <DialogEditUser
            user={rowSelection[0]}
            textButtonShow={true}
            className="w-fit"
          />
        )}
        {rowSelection.length === 1 && (
          <DialogDeleteUser
            user={rowSelection[0]}
            textButtonShow={true}
            className="w-fit text-white"
          />
        )}
        {rowSelection.length > 1 && (
          <DialogDeleteUsersList
            users={rowSelection}
            textButtonShow={true}
            className="w-fit text-white"
          />
        )}
      </div>
      <DialogAddUser className="text-sm justify-start w-fit" />
    </div>
  );
};

export default UserActionsBlock;
