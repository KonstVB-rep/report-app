"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <section className="grid h-screen w-screen place-items-center content-center gap-4 p-5 bg-background text-foreground">
          <div className="max-w-xl text-center">
            <h1 className="mb-4 text-3xl font-bold text-destructive">
              Что-то пошло не так 😢
            </h1>
            <p className="mb-4 text-muted-foreground">
              {error.message || "Произошла непредвиденная ошибка."}
            </p>
            <Button onClick={reset} variant="outline">
              Попробовать снова
            </Button>
          </div>
        </section>
      </body>
    </html>
  );
}
