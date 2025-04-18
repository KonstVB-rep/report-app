import React from "react";

import { getAllDealsRequestSourceByDepartment } from "@/entities/deal/api";
import { RequestsPerSiteChart } from "./charts";



const RequestSourcePage = async () => {
  const data = await getAllDealsRequestSourceByDepartment(1);



  console.log("*****************************", data);

  return (
    <div className="p-4">
      {/* Display the data in a list */}
      <ul>
        {/* {data.map((item, index) => (
          <li key={index}>
            Source: {item.dateRequest.toISOString()}, Resource: {item.resource}
          </li>
        ))} */}

        <RequestsPerSiteChart  deals={data}/>
      </ul>
    </div>
  );
};

export default RequestSourcePage;
