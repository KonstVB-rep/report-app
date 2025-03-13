"use client";

import DialogEditUser from "@/entities/user/ui/DialogEditUser";
import Protected from "@/feature/Protected";

const PersonEdit = () => {
  return (
    <Protected>
      <DialogEditUser />
    </Protected>
  );
};

export default PersonEdit;
