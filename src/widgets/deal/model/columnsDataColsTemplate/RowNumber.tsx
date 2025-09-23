import { Row } from "@tanstack/react-table";

import React from "react";

const RowNumber = <T,>() => {
  return {
    id: "rowNumber",
    header: "№",
    cell: ({ row }: { row: Row<T> }) => Number(row.index) + 1,
    enableHiding: false,
    enableSorting: false,
    accessorFn: () => "",
    maxSize: 100,
    enableResizing: false,
    meta: {
      isNotSearchable: true,
    },
  };
};

export default RowNumber;
