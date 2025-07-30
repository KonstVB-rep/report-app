import { Suspense } from "react";

import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { getAllDealsRequestSourceByDepartment } from "@/entities/deal/api";

import Loading from "./loading";

// Динамический импорт с задержкой (опционально)
const Charts = dynamic(() => import("./ui/Charts"), {
  loading: () => <Loading />,
});
export const metadata: Metadata = {
  title: "Источники заявок",
};

// Отдельный компонент для загрузки данных (для Suspense)
async function ChartsDataLoader() {
  const data = await getAllDealsRequestSourceByDepartment(1);
  if (!data?.deals.length) return <p>Нет данных</p>;
  return <Charts data={data} />;
}

export default function RequestSourcePage() {
  return (
    <div className="p-4">
      <Suspense fallback={<Loading />}>
        <ChartsDataLoader />
      </Suspense>
    </div>
  );
}
