"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { ContactFormSchema, type ContactSchema } from "@/entities/contact/model/schema"

const useAddContactToDeal = (
  contacts: ContactSchema["contacts"],
  onContactsChange: (contacts: ContactSchema["contacts"]) => void,
) => {
  const form = useForm<ContactSchema>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      contacts:
        contacts.length > 0
          ? [...contacts]
          : [
              {
                name: "",
                email: "",
                phone: "",
                position: "",
                id: uuidv4(),
              },
            ],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "contacts",
  })

  const { reset } = form

  useEffect(() => {
    reset({
      contacts:
        contacts.length > 0
          ? [...contacts]
          : [
              {
                name: "",
                email: "",
                phone: "",
                position: "",
                id: uuidv4(),
              },
            ],
    })
  }, [contacts, reset])

  const handleAddNewContactForm = () => {
    return append({
      id: uuidv4(),
      name: "",
      phone: "",
      email: "",
      position: "",
    })
  }

  const handleRemove = (index: number) => {
    remove(index)

    if (fields.length === 1) {
      append({
        id: uuidv4(),
        name: "",
        phone: "",
        email: "",
        position: "",
      })
      onContactsChange([])
    }
  }

  const handleRemoveAll = () => {
    replace([
      {
        id: uuidv4(),
        name: "",
        phone: "",
        email: "",
        position: "",
      },
    ])
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
