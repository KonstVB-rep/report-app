import { ShieldAlert } from "lucide-react";
import React from "react";

interface AccessDeniedMessageProps {
  error?: {
    message: string;
  };
}

const AccessDeniedMessage = ({ error }: AccessDeniedMessageProps) => {
  return (
    <section className="relative flex h-full flex-col items-center justify-center gap-5 p-4">
      <ShieldAlert strokeWidth={1.25} className="h-56 w-56 opacity-10" />
      <h1 className="relative z-[1] rounded-md bg-muted p-5 text-center text-xl font-bold first-letter:capitalize">
        {error ? error?.message : "Неизвестная ошибка"}
      </h1>
    </section>
  );
};

export default AccessDeniedMessage;
// w-[80%] h-[80%] opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-1
