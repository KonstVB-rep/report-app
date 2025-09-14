import { DealFile } from "@prisma/client";
import { animated, useTransition } from "@react-spring/web";

import React from "react";

import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import useAnimateOnDataChange from "@/shared/hooks/useAnimateOnDataChange";
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
  const shouldRender = useAnimateOnDataChange(selectedFilesForDelete);
  const transitions = useTransition(selectedFilesForDelete, {
    keys: (file) => file.id, // Используем уникальные ключи файлов
    from: { opacity: 0, transform: "translateY(-10px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(10px)" },
    config: { duration: 200 }, // Длительность анимации
  });
  return (
    <form className="grid w-full gap-4 py-2" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <p className="text-center text-lg">
          Вы действительно хотите удалить выбранные файлы?
        </p>

        <ul className="grid max-h-[300] gap-1 overflow-y-auto">
          {shouldRender &&
            transitions((styles, file) => {
              const fileName = getFileNameWithoutUuid(file.name);

              return (
                <animated.li
                  key={file.id}
                  style={styles} // Применяем стили из useTransition
                  className="relative flex items-center justify-between break-all rounded-md bg-muted p-2 text-sm pr-[48px]"
                >
                  <span>{fileName}</span>

                  <Button
                    type="button"
                    variant="destructive"
                    className="h-6 w-6 p-1 absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => handleDeleteFromListSelected(file.name)}
                  >
                    <animated.span
                      style={{
                        opacity: styles.opacity,
                        transform: styles.transform, // Применяем анимацию на кнопке
                      }}
                      onClick={() => handleDeleteFromListSelected(file.name)}
                    >
                      <X strokeWidth={1} className="h-6! w-6!" />
                    </animated.span>
                  </Button>
                </animated.li>
              );
            })}
        </ul>
      </div>
      <SubmitFormButton title="Удалить" isPending={isPending} />
    </form>
  );
};

export default FormDeleteFile;
