import { DealFile } from "@prisma/client";

import { useState } from "react";

import dynamic from "next/dynamic";

import { FileX } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/custom-components/ui/Overlay";

import { useDeleteFiles } from "../../hooks/mutate";
import FormDeleteFileSkeleton from "./ui/FormDeleteFileSkeleton";

const FormDeleteFile = dynamic(() => import("./ui/FormDeleteFile"), {
  ssr: false,
  loading: () => <FormDeleteFileSkeleton />,
});

type DeleteFileProps = {
  className?: string;
  selectedFilesForDelete: DealFile[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const DeleteFile = ({
  className,
  selectedFilesForDelete,
  setSelectedFiles,
}: DeleteFileProps) => {
  const [open, setOpen] = useState(false);

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedFiles(new Set());
  };

  const { mutate, isPending } = useDeleteFiles(handleCloseDialog);

  const handleDeleteFromListSelected = (fileName: string) => {
    setSelectedFiles((prev) => {
      const updated = new Set(prev);
      updated.delete(fileName);
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFilesForDelete.length === 0)
      return alert("Выберите файлы для удаления!");

    mutate(selectedFilesForDelete);
  };

  return (
    <>
      <Overlay isPending={isPending} />
      <MotionDivY className={`flex gap-2 ${className}`}>
        <DialogComponent
          open={open}
          onOpenChange={setOpen}
          contentTooltip="Удалить выбранные файлы"
          trigger={
            <Button
              variant="destructive"
              className="h-10 w-10 p-1"
              disabled={isPending}
            >
              <FileX strokeWidth={1} className="h-7! w-7!" />
            </Button>
          }
          classNameContent="sm:max-w-[400px]"
          showX={!isPending}
          disableClose={isPending}
        >
          <FormDeleteFile
            handleSubmit={handleSubmit}
            selectedFilesForDelete={selectedFilesForDelete}
            handleDeleteFromListSelected={handleDeleteFromListSelected}
            isPending={isPending}
          />
        </DialogComponent>
      </MotionDivY>
    </>
  );
};

export default DeleteFile;
