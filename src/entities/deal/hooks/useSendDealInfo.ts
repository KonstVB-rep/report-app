import React, { useCallback } from "react";
import { FieldValues } from "react-hook-form";

import { ContactSchema } from "../model/schema";

const useSetContactsToDeal = <T extends FieldValues>(
  onSubmit: (data: T) => void
) => {
  const [contacts, setContacts] = React.useState<ContactSchema["contacts"]>([]);
  const [selectedContacts, setSelectedContacts] = React.useState<ContactSchema["contacts"]>([]);
  const [isAddContact, setIsAddContact] = React.useState(false);

  const handleDeleteContact = useCallback((id: string) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== id)
    );
  },[]);

  const toggleAddContact = () => {
    setIsAddContact((prev) => !prev);
  };

  const handleSubmit = (data: T) => {
    const fullData = {
      ...data,
      contacts: selectedContacts,
    };

    onSubmit(fullData);
  };

  return { contacts, setContacts,selectedContacts, setSelectedContacts, handleDeleteContact, handleSubmit,isAddContact, toggleAddContact };
};

export default useSetContactsToDeal;
