import React from "react";
import { FieldValues } from "react-hook-form";

import { ContactSchema } from "../model/schema";

const useSetContactsToDeal = <T extends FieldValues>(
  onSubmit: (data: T) => void
) => {
  const [contacts, setContacts] = React.useState<ContactSchema["contacts"]>([]);

  const handleDeleteContact = (id: string) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== id)
    );
  };

  const handleSubmit = (data: T) => {
    const fullData = {
      ...data,
      contacts,
    };

    onSubmit(fullData);
  };

  return { contacts, setContacts, handleDeleteContact, handleSubmit };
};

export default useSetContactsToDeal;
