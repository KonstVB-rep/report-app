import { DealFile } from "@prisma/client";

import { useState } from "react";

import { FileX, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DialogComponent from "@/shared/ui/DialogComponent";
import Overlay from "@/shared/ui/Overlay";

import { useDeleteFiles } from "../../hooks/mutate";
import getFileNameWithoutUuid from "../../libs/helpers/getFileNameWithoutUuid";

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
          <form className="grid w-full gap-4 py-2" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <p className="text-center text-lg">
                Вы действительно хотите удалить выбранные файлы?
              </p>

              <ul className="grid max-h-[300] gap-1 overflow-y-auto">
                <AnimatePresence>
                  {[...selectedFilesForDelete].map((file) => {
                    const fileName = getFileNameWithoutUuid(file.name);
                    return (
                      <motion.li
                        key={file.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="relative flex items-center justify-between break-all rounded-md bg-muted p-2 text-sm pr-[48px]"
                      >
                        <span>{fileName}</span>

                        <Button
                          type="button"
                          variant="destructive"
                          className="h-6 w-6 p-1 absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() =>
                            handleDeleteFromListSelected(file.name)
                          }
                        >
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                            transition={{ duration: 0.2 }}
                            onClick={() =>
                              handleDeleteFromListSelected(file.name)
                            }
                          >
                            <X strokeWidth={1} className="!h-6 !w-6" />
                          </motion.span>
                        </Button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
            <SubmitFormButton title="Удалить" isPending={isPending} />
          </form>
        </DialogComponent>
      </motion.div>
    </>
  );
};

export default DeleteFile;
