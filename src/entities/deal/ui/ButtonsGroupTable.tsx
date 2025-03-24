import { DealType } from "@prisma/client";
import React from "react";
import HoverCardComponent from "@/shared/ui/HoverCard";
import SummaryTableLink from "./SummaryTableLink";
import LinkToUserTable from "./LinkToUserTable";
import ProfileSettings from "@/entities/user/ui/ProfileSettings";
import { useGetUser } from "@/entities/user/hooks";
import { useParams } from "next/navigation";

const ButtonsGroupTable = () => {
   const { userId } = useParams();
  
  const { data: user } = useGetUser(userId as string);

  if(!user) return null

  return (
    <div className="flex items-center justify-between gap-2">
      <ProfileSettings user={user} />
      <div className="flex gap-2">
        <LinkToUserTable />
        <HoverCardComponent title="Сводная таблица">
          <SummaryTableLink type={DealType.PROJECT} />
          <SummaryTableLink type={DealType.RETAIL} />
        </HoverCardComponent>
      </div>
    </div>
  );
};

export default ButtonsGroupTable;
