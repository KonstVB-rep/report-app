"use client"

import { Plus, X } from "lucide-react"
import dynamic from "next/dynamic"
import type { ContactSchema } from "@/entities/contact/model/schema"
import type { Contact, ContactFieldError } from "@/entities/deal/types"
import { Button } from "@/shared/components/ui/button"
import { Form } from "@/shared/components/ui/form"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import InputPhoneForm from "@/shared/custom-components/ui/Inputs/InputPhoneForm"
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import useAddContactToDeal from "../../deals/api/hooks/useAddContactToDeal"

const ContactsList = dynamic(() => import("./ContactsList"), {
  ssr: false,
  loading: () => <LoaderCircle />,
})

type ContactDealProps = {
  contacts: Contact[]
  onContactsChange: (contacts: Contact[]) => void
  contactsKey: string | null | undefined
  handleDeleteContact: (id: string) => void
  selectedContacts: Contact[]
  setSelectedContacts: (contacts: Contact[]) => void
}

const ContactDeal = ({
  contacts = [],
  onContactsChange,
  handleDeleteContact,
  contactsKey,
  selectedContacts,
  setSelectedContacts,
}: ContactDealProps) => {
  const { form, handleRemove, handleAddNewContactForm, handleRemoveAll, fields } =
    useAddContactToDeal(contacts, onContactsChange)

  const onSubmit = (data: ContactSchema) => {
    const newContacts = data.contacts.filter(
      (newContact) => !selectedContacts.some((contact) => contact.id === newContact.id),
    )

    setSelectedContacts([...selectedContacts, ...newContacts])
    handleRemoveAll()
  }

  return (
    <>
      <Form {...form}>
        <form className="p-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2 overflow-y-auto max-h-[60vh] pr-2 box-border">
            {fields.map((field, index: number) => (
              <div
                className="grid gap-2 rounded border p-4"
                key={form.watch(`contacts.${index}.id`)}
              >
                <div className="max-h-full overflow-hidden p-[2px]">
                  <InputTextForm
                    control={form.control}
                    errorMessage={form.formState.errors.contacts?.[index]?.name?.message}
                    label=""
                    name={`contacts.${index}.name`}
                    placeholder="Имя"
                  />

                  <InputTextForm
                    control={form.control}
                    errorMessage={form.formState.errors.contacts?.[index]?.position?.message}
                    label=""
                    name={`contacts.${index}.position`}
                    placeholder="Должность"
                  />

                  <InputPhoneForm
                    control={form.control}
                    errorMessage={
                      (form.formState.errors.contacts?.[index] as ContactFieldError)?._common
                        ?.message
                    }
                    label=""
                    name={`contacts.${index}.phone`}
                    placeholder="Телефон"
                  />

                  <InputTextForm
                    className="w-full valid:not-placeholder-shown:border-green-500 invalid:not-placeholder-shown:border-red-500"
                    control={form.control}
                    errorMessage={
                      (form.formState.errors.contacts?.[index] as ContactFieldError)?._common
                        ?.message
                    }
                    label=""
                    name={`contacts.${index}.email`}
                    placeholder="Email"
                    type="email"
                  />
                </div>

                {(fields.length > 1 || field.name) && (
                  <Button
                    className="w-fit flex items-center justify-center ml-auto"
                    onClick={() => handleRemove(index)}
                    type="button"
                    variant="destructive"
                  >
                    <X className="h-4 w-4" /> Удалить
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-start gap-2">
            <div className="flex gap-2 p-2 pt-4">
              <Button
                className="flex items-center justify-center shrink-0"
                onClick={handleAddNewContactForm}
                size="icon"
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <Button
                className="active:scale-95 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!form.formState.isValid}
                type="submit"
              >
                Сохранить
              </Button>
            </div>
          </div>
        </form>
      </Form>
      {selectedContacts.length > 0 && (
        <DialogComponent
          classNameContent="sm:max-w-[600px] max-h-[82vh] overflow-y-auto"
          dialogTitle="Контакты"
          trigger={
            <Button className="!relative flex w-fit gap-2 p-2" variant="outline">
              Дополнительные контакты
              <span className="absolute -top-2 -right-2 p-[2px] dark:bg-black border border-solid border-primary rounded-full w-5 h-5 flex items-center justify-center">
                {selectedContacts.length}
              </span>
            </Button>
          }
        >
          {contactsKey && (
            <ContactsList
              contacts={selectedContacts}
              handleDeleteContact={handleDeleteContact}
              setSelectedContacts={setSelectedContacts}
            />
          )}
        </DialogComponent>
      )}
    </>
  )
}

export default ContactDeal
