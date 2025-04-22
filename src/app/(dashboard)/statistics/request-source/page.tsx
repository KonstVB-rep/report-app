import React from "react";

import { getAllDealsRequestSourceByDepartment } from "@/entities/deal/api";

import RequestsPerSitePieChart from "./ui/charts";

const RequestSourcePage = async () => {
  const data = await getAllDealsRequestSourceByDepartment(1);
  console.log(data, "*******************");

  if (!data || !data?.deals.length) return null;

  return (
    <div className="p-4">
      {/* Display the data in a list */}
      <ul>
        {/* {data.map((item, index) => (
          <li key={index}>
            Source: {item.dateRequest.toISOString()}, Resource: {item.resource}
          </li>
        ))} */}

        <RequestsPerSitePieChart data={data}/>
      </ul>
    </div>
  );
};

export default RequestSourcePage;
