import { FileDown, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import TooltipComponent from "@/shared/ui/TooltipComponent";

import { useDownLoadFile } from "../../hooks/mutate";

type DownloadOrDeleteFileProps = {
  className: string;
  name: string;
  localPath: string;
};

const DownLoadFile = ({
  className,
  localPath,
  name,
}: DownloadOrDeleteFileProps) => {
  const { mutate: handleDownload, isPending } = useDownLoadFile();

  return (
    <div className={`flex gap-2 ${className}`}>
      <TooltipComponent content="Скачать файл">
        <Button
          onClick={() => handleDownload({ localPath, name })}
          className="h-10 w-10 p-1"
          disabled={isPending}
        >
          {isPending ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <FileDown strokeWidth={1} className="!h-7 !w-7" />
          )}
        </Button>
      </TooltipComponent>
    </div>
  );
};

export default DownLoadFile;
