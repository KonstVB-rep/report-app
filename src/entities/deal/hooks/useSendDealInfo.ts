import React from 'react'
import { ContactSchema } from '../model/schema';
import { FieldValues } from 'react-hook-form';

const useSetContactsToDeal =  <T extends FieldValues>(
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

  

  return { contacts, setContacts, handleDeleteContact,handleSubmit };
}

export default useSetContactsToDeal