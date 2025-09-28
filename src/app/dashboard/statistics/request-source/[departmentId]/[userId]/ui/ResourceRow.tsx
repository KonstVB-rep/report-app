import React, { memo } from "react";

import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent";

type ItemType = {
  name: string;
  value: number;
};

type ResourceRowProps = {
  item: ItemType;
  color: string;
  status: {
    positive: number;
    negative: number;
    inWork: number;
  };
};
const ResourceRow = memo(({ item, color, status }: ResourceRowProps) => (
  <li className="grid gap-2 sm:flex sm:gap-4 items-center border border-solid sm:border-none rounded p-2 sm:p-0">
    <span
      className="relative py-1 px-2 bg-muted sm:bg-transparent border border-solid rounded w-full sm:min-w-max overflow-hidden"
      style={{ borderColor: color }}
    >
      <span
        className="block absolute top-0 left-0 w-2 h-full opacity-50 rounded"
        style={{ width: `${item.value * 2}px`, backgroundColor: color }}
      ></span>
      {item.name}
    </span>
    <div className="flex sm:hidden gap-2 items-center">
      <span className="py-1 flex-1 h-10 aspect-square bg-muted px-2 border border-solid rounded-md border-primary dark:border-muted flex items-center justify-center shrink-0">
        {item.value}
      </span>
      <TooltipComponent content={"Оплачен/Закрыт"}>
        <span className="py-1 flex-1 h-10 aspect-square px-2 border-solid rounded-md flex items-center justify-center border-green-600 border-2 shrink-0">
          {status.positive}
        </span>
      </TooltipComponent>

      <TooltipComponent content={"Не актуально/Отказ"}>
        <span className="py-1 flex-1 h-10 aspect-square px-2 border-solid rounded-md flex items-center justify-center border-red-600 border-2 shrink-0">
          {status.negative}
        </span>
      </TooltipComponent>

      <TooltipComponent content={"Акуально/В работе"}>
        <span className="py-1 flex-1 h-10 aspect-square px-2 border-solid rounded-md flex items-center justify-center border-blue-600 border-2 shrink-0">
          {status.inWork}
        </span>
      </TooltipComponent>
    </div>
  </li>
));

ResourceRow.displayName = "ResourceRow";

export default ResourceRow;
