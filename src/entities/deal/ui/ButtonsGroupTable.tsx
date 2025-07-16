import React from "react";

import { useParams } from "next/navigation";

import { useGetUser } from "@/entities/user/hooks/query";
import ProfileSettings from "@/entities/user/ui/ProfileSettings";

import LinkToUserTable from "./LinkToUserTable";

const ButtonsGroupTable = () => {
  const { userId } = useParams();

  const { data: user } = useGetUser(userId as string);

  if (!user) return null;

  return (
    <div className="flex items-center justify-between gap-2">
      <ProfileSettings user={user} />

      <div className="flex gap-2">
        <LinkToUserTable />
      </div>
    </div>
  );
};

export default ButtonsGroupTable;
