import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { ContactFormSchema, ContactSchema } from "../model/schema";

const useAddContactToDeal = (
  contacts: ContactSchema["contacts"],
  onContactsChange: (contacts: ContactSchema["contacts"]) => void
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
                id: crypto.randomUUID(),
              },
            ],
    },
  });

  useEffect(() => {
    form.reset({
      contacts:
        contacts.length > 0
          ? [...contacts]
          : [
              {
                name: "",
                email: "",
                phone: "",
                position: "",
                id: crypto.randomUUID(),
              },
            ],
    });
  }, [contacts, form]);

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const handleAddNewContactForm = () => {
    return append({
      id: crypto.randomUUID(),
      name: "",
      phone: "",
      email: "",
      position: "",
    });
  };

  const handleRemove = (index: number) => {
    remove(index);

    if (fields.length === 1) {
      append({
        id: crypto.randomUUID(),
        name: "",
        phone: "",
        email: "",
        position: "",
      });
      onContactsChange([]);
    }
  };

  const handleRemoveAll = () => {
    replace([
      {
        id: crypto.randomUUID(),
        name: "",
        phone: "",
        email: "",
        position: "",
      },
    ]);
    onContactsChange([]);
  };

  return {
    form,
    handleRemove,
    handleAddNewContactForm,
    handleRemoveAll,
    fields,
  };
};

export default useAddContactToDeal;
