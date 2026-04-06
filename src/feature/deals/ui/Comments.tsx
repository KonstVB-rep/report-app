import { useState } from "react"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Textarea } from "@/shared/components/ui/textarea"

type CommentsProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  getError: (name: string) => string
}

const Comments = <T extends FieldValues>({ form, getError }: CommentsProps<T>) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)

  return (
    <FormField
      control={form.control}
      name={"comments" as Path<T>}
      render={({ field }) => (
        <FormItem className="col-span-full relative">
          <FormLabel className="flex justify-between items-center">
            Примечание / Комментарии
            <Button
              className="absolute right-0 top-[22px] z-10"
              onClick={() => setIsEdit((prev) => !prev)}
              size="icon"
              title={isEdit ? "Сохранить" : "Редактировать"}
              type="button"
            >
              {isEdit ? (
                <svg
                  aria-label="Сохранить комментарий"
                  className="lucide lucide-pencil-off-icon lucide-pencil-off"
                  fill="none"
                  height="24"
                  role="img"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982" />
                  <path d="m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353" />
                  <path d="m15 5 4 4" />
                  <path d="m2 2 20 20" />
                </svg>
              ) : (
                <svg
                  aria-label="Редактировать комментарий"
                  className="lucide lucide-pencil-icon lucide-pencil"
                  fill="none"
                  height="24"
                  role="img"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                  <path d="m15 5 4 4" />
                </svg>
              )}
            </Button>
          </FormLabel>

          <FormControl>
            <Textarea
              className="pt-7"
              disabled={!isEdit}
              placeholder="Введите комментарии"
              {...field}
            />
          </FormControl>

          {getError("comments") && (
            <FormMessage className="text-red-500">{getError("comments")}</FormMessage>
          )}
        </FormItem>
      )}
    />
  )
}

export default Comments
