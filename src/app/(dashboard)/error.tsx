"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error("Server error:", error);
  return (
    <section className="grid h-full place-items-center content-center gap-4 p-5 min-h-[50vh]">
      <h2 className="text-xl text-red-600 text-center">
        Произошла ошибка загрузки данных.
      </h2>
      <p className="text-center">{error.message}</p>
      <Button variant="outline" onClick={reset}>
        Повторить запрос
      </Button>
    </section>
  );
}
