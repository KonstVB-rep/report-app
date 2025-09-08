import React from "react";

import Link from "next/link";

import { Bot, Users } from "lucide-react";

const AdminPanel = () => {
  return (
    <div className="px-5 pb-5 grid place-items-center gap-5 w-full">
      <h1 className="text-2xl text-center">Панель администратора</h1>
      <div className="flex flex-wrap gap-3 justify-start w-full">
        <Link
          className="btn_hover text-sm justify-start"
          href="/adminboard/bots"
        >
          <Bot size={16} />
          Телеграмм боты
        </Link>
        <Link
          className="btn_hover text-sm justify-start"
          href="/adminboard/employees"
        >
          <Users size={16} />
          Сотрудники
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
