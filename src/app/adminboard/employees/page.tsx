import React from "react";

import EmployeesList from "./ui/EmployeesList";

const EmployeesPage = () => {
  return (
    <div className="p-5 overflow-auto max-h-[94vh]">
      <EmployeesList />
    </div>
  );
};

export default EmployeesPage;
