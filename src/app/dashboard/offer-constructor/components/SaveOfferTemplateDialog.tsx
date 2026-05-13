import type React from "react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import { useSaveOfferTemplate } from "../hooks/mutate"
import { selectData, useOfferStoreTable } from "../store"

const SaveOfferTemplateDialog = () => {
  const { mutate, isPending } = useSaveOfferTemplate()

  const data = useOfferStoreTable(selectData)

  const hadleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const templateName = formData.get("name") as string

    if (!templateName) {
      toast.error("Введите название шаблона")
      return
    }

    mutate({
      data,
      name: templateName,
    })
  }
  return (
    <DialogComponent
      classNameContent="sm:max-w-[425px]"
      dialogTitle="Добавить шаблон"
      footer={
        <Button form="saveoffertemplate" type="submit">
          {isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      }
      trigger={<Button>Сохранить</Button>}
    >
      <div>
        <form action="" id="saveoffertemplate" onSubmit={hadleSubmit}>
          <Input name="name" placeholder="Название шаблона" />
        </form>
      </div>
    </DialogComponent>
  )
}

export default SaveOfferTemplateDialog
