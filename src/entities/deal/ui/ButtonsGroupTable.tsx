import SummaryTableLink from "@/entities/department/ui/SummaryTableLink";
import { DealType } from "@prisma/client";

import React from "react";
import HoverCardComponent from "@/shared/ui/HoverCard";
import { useParams } from "next/navigation";
import AddNewDeal from "./Modals/AddNewDeal";

const ButtonsGroupTable = () => {
  const {dealType} = useParams()
  return (
    <div className="flex items-end justify-between">
      <AddNewDeal type={dealType as string} />
      {/* <UploadExcel/> */}
      <div className="flex gap-1">
        <HoverCardComponent title="Сводная таблица">
          <SummaryTableLink type={DealType.PROJECT} />
          <SummaryTableLink type={DealType.RETAIL} />
        </HoverCardComponent>
      </div>
    </div>
  );
};

export default ButtonsGroupTable;
