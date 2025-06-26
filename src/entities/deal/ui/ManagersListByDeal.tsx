import React from "react";

import { ManagerShortInfo } from "../types";

type ManagersListByDealProps = {
  managers: ManagerShortInfo[] | undefined;
  userId: string;
};

const ManagersListByDeal = ({ managers, userId }: ManagersListByDealProps) => {
  if (!managers || managers.length < 1) return null;

  const responsibleManager = managers?.find((man) => man.id === userId);

  const managerSecondary = managers.filter((man) => man.id !== userId);

  return (
    <div>
      <div className="flex flex-wrap gap-2 divide-x divide-solid">
        <p className="grid gap-1 px-2">
          <span className="text-xs text-stone-600">Ответственный менеджер</span>
          <span className="text-sm capitalize">
            {responsibleManager?.managerName}
          </span>
          <span className="text-xs text-stone-600 first-letter:uppercase">
            {responsibleManager?.position}
          </span>
        </p>
        {managerSecondary?.map((man) => {
          return (
            <p
              key={man.id}
              className="capitalize flex flex-col justify-end gap-1 px-2"
            >
              <span className="text-sm capitalize">{man.managerName}</span>
              <span className="text-xs text-stone-600">{man.position}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default ManagersListByDeal;
