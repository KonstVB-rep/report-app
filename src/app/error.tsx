"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="grid h-full place-items-center content-center gap-4">
      <h2 className="text-2xl">{error.message}</h2>
      <h3 className="lg">
        Если у вас есть права для просмотра данной страницы, попробуйте
        повторить запрос.
      </h3>
      <Button variant="outline" onClick={() => reset()}>
        Повторить запрос
      </Button>
    </section>
  );
}
