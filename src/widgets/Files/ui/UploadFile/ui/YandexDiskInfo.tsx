import React from "react";

import { Progress } from "@/components/ui/progress";

type YandexDiskinfoProps = {
  used_space: number;
  total_space: number;
  diskOccupancy: number;
};

const YandexDiskInfo = ({
  used_space,
  total_space,
  diskOccupancy,
}: YandexDiskinfoProps) => {
  return (
    <div className="grid w-full place-items-center gap-2 p-1">
      <p>Диск</p>

      <div className="grid gap-2">
        <Progress value={diskOccupancy} color="orange" />

        <span className="text-xs">
          {(used_space / 1024 / 1024).toFixed(2)} MB /
          {(total_space / 1024 / 1024).toFixed(2)} MB
        </span>
      </div>
    </div>
  );
};

export default YandexDiskInfo;
