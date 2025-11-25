import type React from "react"
import type { DealFile } from "@prisma/client"
import { animated, useTransition } from "@react-spring/web"
import { X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import useAnimateOnDataChange from "@/shared/hooks/useAnimateOnDataChange"
import getFileNameWithoutUuid from "@/widgets/Files/libs/helpers/getFileNameWithoutUuid"

type FormDeleteFileProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  selectedFilesForDelete: DealFile[]
  handleDeleteFromListSelected: (fileName: string) => void
  isPending: boolean
}

const FormDeleteFile = ({
  handleSubmit,
  selectedFilesForDelete,
  handleDeleteFromListSelected,
  isPending,
}: FormDeleteFileProps) => {
  const shouldRender = useAnimateOnDataChange(selectedFilesForDelete)
  const transitions = useTransition(selectedFilesForDelete, {
    keys: (file) => file.id, // Используем уникальные ключи файлов
    from: { opacity: 0, transform: "translateY(-10px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(10px)" },
    config: { duration: 200 }, // Длительность анимации
  })
  return (
    <form className="grid w-full gap-4 py-2" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <p className="text-center text-lg">Вы действительно хотите удалить выбранные файлы?</p>

        <ul className="grid max-h-[300] gap-1 overflow-y-auto">
          {shouldRender &&
            transitions((styles, file) => {
              const fileName = getFileNameWithoutUuid(file.name)

              return (
                <animated.li
                  className="relative flex items-center justify-between break-all rounded-md bg-muted p-2 text-sm pr-[48px]"
                  key={file.id} // Применяем стили из useTransition
                  style={styles}
                >
                  <span>{fileName}</span>

                  <Button
                    className="h-6 w-6 p-1 absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => handleDeleteFromListSelected(file.name)}
                    type="button"
                    variant="destructive"
                  >
                    <animated.span
                      onClick={() => handleDeleteFromListSelected(file.name)}
                      style={{
                        opacity: styles.opacity,
                        transform: styles.transform, // Применяем анимацию на кнопке
                      }}
                    >
                      <X className="h-6! w-6!" strokeWidth={1} />
                    </animated.span>
                  </Button>
                </animated.li>
              )
            })}
        </ul>
      </div>
      <SubmitFormButton isPending={isPending} title="Удалить" />
    </form>
  )
}

export default FormDeleteFile
