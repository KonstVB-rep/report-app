import React from "react";
import { ManagerShortInfo } from "../types";

type ManagersListByDealProps = {
  managers?: ManagerShortInfo[];
  userId: string;
};

const ManagersListByDeal = ({ managers, userId }: ManagersListByDealProps) => {
  if (!managers || managers.length === 0) return null;

  const responsible = managers.find((m) => m.id === userId);
  const assistants = managers.filter((m) => m.id !== userId);

  return (
    <div className="flex flex-wrap gap-2 divide-x divide-solid">
      {responsible && (
        <div className="grid gap-1 px-2">
          <span className="text-xs text-stone-600">Ответственный менеджер</span>
          <span className="text-sm capitalize">{responsible.managerName}</span>
          <span className="text-xs text-stone-600 first-letter:uppercase">
            {responsible.position}
          </span>
        </div>
      )}
      {assistants.map((m) => (
        <div key={m.id} className="grid gap-1 px-2">
          <span className="text-sm capitalize">{m.managerName}</span>
          <span className="text-xs text-stone-600">{m.position}</span>
        </div>
      ))}
    </div>
  );
};

export default ManagersListByDeal;
