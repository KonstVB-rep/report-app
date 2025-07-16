"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const didHandleError = useRef(false);

  useEffect(() => {
    if (!didHandleError.current) {
      console.error(error);
      didHandleError.current = true;
    }
  }, [error]);

  return (
    <section className="grid h-full place-items-center content-center gap-4 text-center">
      <h2 className="text-2xl font-semibold">Что-то пошло не так</h2> 
      <p className="text-muted-foreground">
        Попробуйте повторить запрос или перезагрузите страницу.
      </p>
      <Button variant="outline" onClick={reset}>
        Повторить запрос
      </Button>
    </section>
  );
}
