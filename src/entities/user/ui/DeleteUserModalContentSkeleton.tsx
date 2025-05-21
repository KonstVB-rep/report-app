import { DialogTitle } from "@radix-ui/react-dialog";

import React from "react";

const DeleteUserModalContentSkeleton = () => {
  return (
    <div className="grid gap-5">
      <DialogTitle className="h-6 w-1/2 m-auto animate-pulse rounded-md bg-muted" />

      <div className="grid gap-2">
        <div className="w-full h-6 animate-pulse rounded-md bg-muted" />
        <div className="w-full h-6 animate-pulse rounded-md bg-muted" />
        <div className="w-full h-6 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="h-9 animate-pulse rounded-md bg-muted" />
        <div className="h-9 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
};

export default DeleteUserModalContentSkeleton;
