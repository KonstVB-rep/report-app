"use client"

import React, { useRef } from "react"
import { Save } from "lucide-react"
import { useSearchParams } from "next/navigation"
import z from "zod"
import { Button } from "@/shared/components/ui/button"
import { DialogClose } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import { useSaveFilter } from "../hooks/mutate"

const pageParamsSchema = z.object({
  userId: z.string(),
})

const SaveFilter = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { userId } = useTypedParams(pageParamsSchema)

  const searchParams = useSearchParams()
  const [open, setOpen] = React.useState(false)

  const { mutate, isPending } = useSaveFilter(() => setOpen(false))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputRef.current) {
      mutate({
        ownerId: userId as string,
        data: {
          filterName: inputRef.current.value,
          filterValue: searchParams.toString(),
          isActive: false,
        },
      })
    }
  }

  return (
    <DialogComponent
      classNameContent="w-[400px] z-50"
      contentTooltip="Сохранить фильтр"
      dialogTitle="Сохранить фильтр"
      onOpenChange={setOpen}
      open={open}
      trigger={
        <Button className="btn_hover" size={"icon"} variant={"secondary"}>
          <Save />
        </Button>
      }
    >
      <form action="" className="grid gap-5" onSubmit={handleSubmit}>
        <Label>
          <Input placeholder="Название фильтра" ref={inputRef} />
        </Label>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Не сохранять
            </Button>
          </DialogClose>
          <SubmitFormButton disabled={isPending} isPending={isPending} title="Сохранить" />
        </div>
      </form>
    </DialogComponent>
  )
}

export default SaveFilter
