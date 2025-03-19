import SummaryTableLink from "@/entities/department/ui/SummaryTableLink";
import { DealType } from "@prisma/client";

import React from "react";
import AddNewProject from "./Modals/AddNewProject";
import HoverCardComponent from "@/shared/ui/HoverCardComponent";

const ButtonsGroupTable = () => {
  return (
    <div className="flex items-end justify-between">
      <AddNewProject />
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
