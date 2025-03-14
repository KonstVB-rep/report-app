import { ShieldAlert } from "lucide-react";
import React from "react";

const AccessDeniedMessage  = ({ error }: { error: unknown }) => {
  return (
    <section className="relative p-4 h-full flex flex-col gap-5 items-center justify-center">
      <ShieldAlert strokeWidth={1.25} className="w-56 h-56 opacity-10" />
      <h1 className="relative text-center text-xl font-bold p-5 bg-muted rounded-md z-[1] ">
        {error instanceof Error ? error.message : "Неизвестная ошибка"}
      </h1>

    </section>
  );
};

export default AccessDeniedMessage ;
// w-[80%] h-[80%] opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-1