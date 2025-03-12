"use client";

import DialogEditUser from "@/entities/user/ui/DialogEditUser";
import ProtectedRoute from "@/feature/protected-route";

const PersonEdit = () => {
  return (
    <ProtectedRoute>
      <DialogEditUser />
    </ProtectedRoute>
  );
};

export default PersonEdit;
