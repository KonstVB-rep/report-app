import { DealFile } from "@prisma/client";

import React from "react";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import getFileNameWithoutUuid from "@/widgets/Files/libs/helpers/getFileNameWithoutUuid";

type FormDeleteFileProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedFilesForDelete: DealFile[];
  handleDeleteFromListSelected: (fileName: string) => void;
  isPending: boolean;
};

const FormDeleteFile = ({
  handleSubmit,
  selectedFilesForDelete,
  handleDeleteFromListSelected,
  isPending,
}: FormDeleteFileProps) => {
  return (
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
                    onClick={() => handleDeleteFromListSelected(file.name)}
                  >
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleDeleteFromListSelected(file.name)}
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
  );
};

export default FormDeleteFile;
