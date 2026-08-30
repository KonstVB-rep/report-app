"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { ContactFormSchema, type ContactSchema } from "@/entities/contact/model/schema"

const createEmptyContact = () => ({
  id: uuidv4(),
  name: "",
  email: "",
  phone: "",
  position: "",
})

const useAddContactToDeal = (
  contacts: ContactSchema["contacts"],
  onContactsChange: (contacts: ContactSchema["contacts"]) => void,
) => {
  const form = useForm<ContactSchema>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      contacts: contacts.length > 0 ? contacts : [createEmptyContact()],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "contacts",
  })

  const { reset } = form

  useEffect(() => {
    reset({
      contacts: contacts.length > 0 ? contacts : [createEmptyContact()],
    })
  }, [contacts, reset])

  const handleAddNewContactForm = () => {
    append(createEmptyContact())
  }

  const handleRemove = (index: number) => {
    remove(index)

    if (fields.length === 1) {
      append(createEmptyContact())
      onContactsChange([])
    }
  }

  const handleRemoveAll = () => {
    replace([createEmptyContact()])
    onContactsChange([])
  }

  return {
    form,
    handleRemove,
    handleAddNewContactForm,
    handleRemoveAll,
    fields,
  }
}

export default useAddContactToDeal
