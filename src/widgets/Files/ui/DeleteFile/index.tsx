import { DealFile } from "@prisma/client";

import { useState } from "react";

import dynamic from "next/dynamic";

import { FileX } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import DialogComponent from "@/shared/ui/DialogComponent";
import Overlay from "@/shared/ui/Overlay";

import { useDeleteFiles } from "../../hooks/mutate";
import FormDeleteFileSkeleton from "./ui/FormDeleteFileSkeleton";
import { withAuthCheck } from "@/shared/lib/helpers/withAuthCheck";

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

  const handleSubmit = withAuthCheck(async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFilesForDelete.length === 0)
      return alert("Выберите файлы для удаления!");

    mutate(selectedFilesForDelete);
  });

  return (
    <>
      <Overlay isPending={isPending} />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.2 }}
        className={`flex gap-2 ${className}`}
      >
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
              <FileX strokeWidth={1} className="!h-7 !w-7" />
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
      </motion.div>
    </>
  );
};

export default DeleteFile;
