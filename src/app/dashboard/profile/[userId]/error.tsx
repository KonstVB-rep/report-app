"use client";
import { Button } from "@/components/ui/button";
import { TOAST } from "@/entities/user/ui/Toast";
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
    if (error && !handleErrorRef.current) {
      TOAST.ERROR(error.message);
    }

    return () => {
      handleErrorRef.current = true;
    };
  }, [error]);

  return (
    <section className="grid place-items-center gap-4 h-full content-center">
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
