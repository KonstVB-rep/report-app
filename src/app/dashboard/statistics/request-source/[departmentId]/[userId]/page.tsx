import React from "react";

import dynamic from "next/dynamic";

import { getAllDealsRequestSourceByDepartment } from "@/entities/deal/api";

const Charts = dynamic(() => import("./ui/Charts"));

const RequestSourcePage = async () => {
  const data = await getAllDealsRequestSourceByDepartment(1);

  if (!data || !data?.deals.length) return null;

  return (
    <div className="p-4">
      <Charts data={data} />
    </div>
  );
};

export default RequestSourcePage;
