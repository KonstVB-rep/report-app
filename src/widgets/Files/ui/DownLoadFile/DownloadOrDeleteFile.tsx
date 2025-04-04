import { Button } from "@/components/ui/button";

import TooltipComponent from "@/shared/ui/TooltipComponent";
import { FileDown, FileX, Loader } from "lucide-react";
import { useDeleteFile, useDownLoadFile } from "../../hooks/mutate";
import { DealType } from "@prisma/client";
import DialogComponent from "@/shared/ui/DialogComponent";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";;

type DownloadOrDeleteFileProps = {
  className: string;
  id: string;
  name: string;
  localPath: string;
  userId: string;
  dealId: string;
  dealType: DealType;
};

export default function DownloadOrDeleteFile({
  className,
  id,
  localPath,
  name,
  dealType,
  userId
}: DownloadOrDeleteFileProps) {
const { mutate: handleDownload, isPending: isPendingDownload } = useDownLoadFile()
const { mutate, isPending: isPendingDelete }  = useDeleteFile(id, dealType, userId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(localPath);
  };
  

  return (
    <div className={`flex gap-2 ${className}`}>
      <TooltipComponent content="Скачать файл">
        <Button onClick={() => handleDownload({localPath, name})} className="h-10 w-10 p-1" disabled={isPendingDownload}>
          {isPendingDownload ? <Loader className="h-5 w-5 animate-spin" /> : <FileDown strokeWidth={1} className="!h-7 !w-7" />}
        </Button>
      </TooltipComponent>
      <DialogComponent
        contentTooltip="Удалить файл"
        trigger={
          <Button variant="destructive" className="h-10 w-10 p-1">
            <FileX strokeWidth={1} className="!h-7 !w-7" />
          </Button>
        }
        classNameContent="sm:max-w-[400px]"
      >
        <form className="grid gap-4 w-full py-2" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <p className="text-lg text-center">Вы действительно хотите удалить файл?</p>
            <p className="bg-muted p-2 text-md break-all rounded-md">{name}</p>
          </div>
          <SubmitFormButton title="Удалить" isPending={isPendingDelete}/>
        </form>
      </DialogComponent>
    </div>
  );
}
