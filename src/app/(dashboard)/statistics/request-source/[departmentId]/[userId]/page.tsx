import React from "react";

import { getAllDealsRequestSourceByDepartment } from "@/entities/deal/api";

import Charts from "./ui/Charts";

const RequestSourcePage = async () => {
  const data = await getAllDealsRequestSourceByDepartment(1);

  if (!data || !data?.deals.length) return null;

  return (
    <div className="p-4">
        <Charts data={data}/>   
    </div>
  );
};

export default RequestSourcePage;
