import { FileDown, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import TooltipComponent from "@/shared/ui/TooltipComponent";

import { useDownLoadFile } from "../../hooks/mutate";

type DownloadFileProps = {
  className: string;
  name: string;
  localPath: string;
  fileName: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
};

const DownLoadOrCheckFile = ({
  className,
  localPath,
  name,
  fileName,
  id,
  onChange,
  checked,
}: DownloadFileProps) => {
  const { mutate: handleDownload, isPending } = useDownLoadFile();

  const handleDelete = () => {
    handleDownload({ localPath, name });
  };

  return (
    <>
      {isPending && (
        <div className="absolute inset-0 z-20 border-2 bordeer-solid border-blue-600 animate-pulse rounded-md" />
      )}
      <div
        className={`gap-2 ${isPending ? "flex bg-black/80" : "hidden"} rounded-md group-hover:flex group-focus-visible:flex ${className}`}
      >
        <TooltipComponent content={`Скачать файл - ${fileName}`}>
          <Button
            onClick={handleDelete}
            className={`h-10 w-10 p-1 disabled:cursor-not-allowed ${isPending && "animate-bounce opacity-100! scale-125!"}`}
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="h-7 w-7 animate-spin" />
            ) : (
              <FileDown strokeWidth={1} className="!h-7 !w-7" />
            )}
          </Button>
        </TooltipComponent>

        {!isPending && (
          <input
            type="checkbox"
            id={id}
            onChange={onChange}
            checked={checked}
            className="absolute hidden checked:block group-hover:block group-focus-visible:block -right-1 -top-1 z-[11] h-5 w-5 cursor-pointer accent-red-700"
          />
        )}
      </div>
    </>
  );
};

export default DownLoadOrCheckFile;
