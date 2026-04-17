import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pen, Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { SingleContactFormSchema, type SingleContactSchema } from "@/entities/contact/model/schema"
import type { Contact } from "@/entities/deal/types"
import { Button } from "@/shared/components/ui/button"
import ContactsDealFormBody from "./ContactsDealFormBody"

interface ContactCardProps {
  contact: Contact
  onDelete: (id: string) => void
  updateContacts: (data: SingleContactSchema) => void
}

const ContactCardInForm: React.FC<ContactCardProps> = ({ contact, onDelete, updateContacts }) => {
  const fieldsList: { label: string; value?: string | null }[] = [
    { label: "Имя", value: contact.name },
    { label: "Должность", value: contact.position },
    { label: "Телефон", value: contact.phone },
    { label: "Email", value: contact.email },
  ]

  const [editContact, setEditContact] = React.useState(false)

  const form = useForm<SingleContactSchema>({
    resolver: zodResolver(SingleContactFormSchema),
    defaultValues: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      position: contact.position,
      id: contact.id,
    },
  })

  const handleEdit = () => {
    setEditContact((prev) => !prev)
  }

  const onSubmit = (data: SingleContactSchema) => {
    updateContacts(data)
    handleEdit()
  }

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="grid w-full gap-1 rounded-md text-sm [word-break:break-word]">
        {editContact ? (
          <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2 overflow-y-auto max-h-[60vh] box-border">
              <ContactsDealFormBody form={form} />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="active:scale-95 transition-transform duration-150"
                onClick={() => handleEdit()}
                size={"icon"}
                title="Отменить редактирование"
                variant="default"
              >
                <Pen />
              </Button>

              <Button className="active:scale-95 transition-transform duration-150" type="submit">
                Сохранить
              </Button>
            </div>
          </form>
        ) : (
          fieldsList
            .filter(({ value }) => value)
            .map(({ label, value }) => (
              <p
                className="flex items-center gap-1 rounded bg-black/20 p-2 dark:bg-black/50"
                key={label}
              >
                <span className="font-bold">{label}:</span>
                <span className="capitalize">{value}</span>
              </p>
            ))
        )}
        <div className="flex items-center justify-end gap-2">
          {!editContact && (
            <>
              <Button
                className="active:scale-95 transition-transform duration-150"
                onClick={() => onDelete(contact.id)}
                size={"icon"}
                title="Удалить контакт"
                variant="destructive"
              >
                <Trash />
              </Button>

              <Button
                className="active:scale-95 transition-transform duration-150"
                onClick={() => handleEdit()}
                size={"icon"}
                title="Редактировать контакт"
                variant="outline"
              >
                <Pen />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactCardInForm
