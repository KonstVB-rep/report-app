import { Button } from "@/shared/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Textarea } from "@/shared/components/ui/textarea"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import z from "zod"
import { useAddEquipment } from "../hooks/mutate"
import { toDec } from "@/shared/lib/utils"

const defaultEquipmentValues = {
  name: "",
  image: "",
  description: "",
  price: 0,
}

export const EquipmentFormSchema = z.object({
  name: z.string().min(1, "Обязательное поле"),
  image: z.string().optional().nullable(),
  description: z.string().min(1, "Обязательное поле"),
  price: z.string().min(1, "Обязательное поле"),
})

export type EquipmentFormValues = z.infer<typeof EquipmentFormSchema>

const AddNewEquipment = () => {
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(EquipmentFormSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
      price: "0,00",
    },
  })

  const { mutateAsync, isPending } = useAddEquipment(form.reset)

  const handleSubmit = async (values: EquipmentFormValues) => {
    mutateAsync({
      name: values.name,
      image: values.image || "",
      description: values.description,
      price: values.price,
    })
  }

  const getError = (name: keyof typeof defaultEquipmentValues) =>
    form.formState.errors[name]?.message as string

  return (
    <DialogComponent
      classNameContent="sm:max-w-[400px]"
      disableClose
      trigger={
        <Button aria-label="Добавить новую сделку" className="ml-auto" variant="outline">
          <Plus />
        </Button>
      }
    >
      <Form {...form}>
        <form
          className={`grid max-h-[85dvh] w-full gap-5 overflow-y-auto transform duration-150`}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="text-center font-semibold uppercase">Новое оборудование</div>
          <div className="grid gap-2 p-2">
            <div className="flex flex-col gap-1">
              <InputTextForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("name")}
                label="Наименование"
                name="name"
                placeholder="Название..."
                required
                showStarRequired
              />

              <InputTextForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("image")}
                label="Изображение"
                name="image"
                placeholder="Изображение..."
              />

              <FormField
                control={form.control}
                name={"description"}
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>
                      Описание
                      <span className="text-red-700">*</span>
                    </FormLabel>

                    <FormControl>
                      <Textarea disabled={isPending} placeholder="Описание" required {...field} />
                    </FormControl>

                    {getError("description") && (
                      <FormMessage className="text-red-500">{getError("description")}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <InputTextForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("price")}
                label="Цена"
                name="price"
                placeholder="Цена"
              />
            </div>

            <SubmitFormButton
              className="ml-auto mr-2 w-max"
              isPending={isPending}
              title="Сохранить"
            />
          </div>
        </form>
      </Form>
    </DialogComponent>
  )
}

export default AddNewEquipment
