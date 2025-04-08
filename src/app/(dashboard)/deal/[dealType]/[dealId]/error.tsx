"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleErrorRef = useRef(false);
  useEffect(() => {
    console.error(error);
    return () => {
      handleErrorRef.current = true;
    };
  }, [error]);

  return (
    <section className="grid h-full place-items-center content-center gap-4">
      <h2 className="text-2xl">Что-то пошло не так!!!</h2>
      <h3 className="lg">
        Попробуйте повторить запрос или перезагрузите страницу.
      </h3>
      <Button variant="outline" onClick={() => reset()}>
        Повторить запрос
      </Button>
    </section>
  );
}
