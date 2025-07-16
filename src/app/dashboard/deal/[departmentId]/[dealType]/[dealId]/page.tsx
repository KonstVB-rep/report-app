"use client";

import { DealType } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ProjectItemInfo = dynamic(
  () => import("@/entities/deal/ui/ProjectInfo"),
  { ssr: false }
);
const RetailItemInfo = dynamic(() => import("@/entities/deal/ui/RetailInfo"), {
  ssr: false,
});
const NotFoundDeal = dynamic(() => import("@/entities/deal/ui/NotFoundDeal"), {
  ssr: false,
});

function renderDealInfoByType(dealType?: string) {
  if (!dealType) return <NotFoundDeal />;

  switch (dealType.toUpperCase()) {
    case DealType.PROJECT:
      return <ProjectItemInfo />;
    case DealType.RETAIL:
      return <RetailItemInfo />;
    default:
      return <NotFoundDeal />;
  }
}

const DealPageInfo = () => {
  const { dealType } = useParams();
  return renderDealInfoByType(dealType as string);
};

export default DealPageInfo;
