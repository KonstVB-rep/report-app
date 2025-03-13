"use client";
import useStoreUser from "@/entities/user/store/useStoreUser";
import Protected from "@/feature/Protected";
import Link from "next/link";

import React from "react";

const SummaryTableLink = () => {
  const { authUser } = useStoreUser();
  if (!authUser) return null;
  return (
    <Protected>
      <Link
        href={`/dashboard/summary-table/${authUser.id}`}
        className="btn_hover border max-w-max"
        title="перейти на страницу сводной таблицы"
      >
        Сводная таблица отчетов
      </Link>
    </Protected>
  );
};

export default SummaryTableLink;
