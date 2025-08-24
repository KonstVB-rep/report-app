"use client";

import { DealType } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import Loading from "./loading";

const ProjectItemInfo = dynamic(
  () => import("@/feature/deals/ui/ProjectInfo"),
  { ssr: false, loading: () => <Loading /> }
);
const RetailItemInfo = dynamic(() => import("@/feature/deals/ui/RetailInfo"), {
  ssr: false,
  loading: () => <Loading />,
});
const NotFoundDeal = dynamic(() => import("@/entities/deal/ui/NotFoundDeal"), {
  ssr: false,
  loading: () => <Loading />,
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
