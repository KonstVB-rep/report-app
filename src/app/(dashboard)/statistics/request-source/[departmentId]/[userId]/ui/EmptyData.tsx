import { FileQuestion } from "lucide-react";
import React from "react";

const EmptyData = () => {
  return (
    <div className="grid justify-items-center text-xl p-4 border border-solid border-muted rounded-md">
      <FileQuestion size="100px" strokeWidth={1} />
      <span>Нет данных для отображения</span>
    </div>
  );
};

export default EmptyData;
