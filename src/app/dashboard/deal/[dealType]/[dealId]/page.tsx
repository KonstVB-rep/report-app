"use client";

import NotFoundDeal from "@/entities/deal/ui/NotFoundDeal";
import ProjectItemInfo from "@/entities/deal/ui/ProjectInfo";
import RetailItemInfo from "@/entities/deal/ui/RetailInfo";
import { DealType } from "@prisma/client";
import { useParams } from "next/navigation";
import React from "react";

const switchCase = (dealType: string) => {

  switch (dealType.toUpperCase()) {
    case DealType.PROJECT:
      return <ProjectItemInfo />;
    case DealType.RETAIL:
      return <RetailItemInfo />;
    default:
      return <NotFoundDeal/>
  }
};

const DealPageInfo = () => {
  const { dealType } = useParams();

  return switchCase(dealType as string);
};

export default DealPageInfo;
