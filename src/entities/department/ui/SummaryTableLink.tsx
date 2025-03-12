"use client";
import useStoreUser from "@/entities/user/store/useStoreUser";
import ProtectedRoute from "@/feature/protected-route";
import Link from "next/link";

import React from "react";

const SummaryTableLink = () => {
  const { authUser } = useStoreUser();
  if (!authUser) return null;
  return (
    <ProtectedRoute>
      <Link
        href={`/dashboard/summary-table/${authUser.id}`}
        className="btn_hover border max-w-max"
        title="перейти на страницу сводной таблицы"
      >
        Сводная таблица отчетов
      </Link>
    </ProtectedRoute>
  );
};

export default SummaryTableLink;
