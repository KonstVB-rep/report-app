import { FileQuestion } from "lucide-react";
import React from "react";

const NotFoundDeal = () => {
  return (
    <section className="p-4 w-full h-full relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center">
        <h1 className="text-2xl p-4 text-center uppercase">
          Данные по сделке не найдены
        </h1>
        <FileQuestion strokeWidth={1} className="w-[50%] h-[50%] opacity-30" />
      </div>
    </section>
  );
};

export default NotFoundDeal;
