import React from "react";

import { SingleContactSchema } from "../model/schema";
import { Contact } from "../types";
import ContactCardInForm from "./ContactCardInForm";

type ContactsListProps = {
  contacts: Contact[] | [];
  handleDeleteContact: (id: string) => void;
  setSelectedContacts: (contacts: Contact[]) => void;
};

const ContactsList = ({
  contacts,
  handleDeleteContact,
  setSelectedContacts,
}: ContactsListProps) => {
  if (contacts.length === 0) {
    return null;
  }

  const updateContacts = (data: SingleContactSchema) => {
    const updatedContacts = contacts.map((contact) => {
      if (contact.id === data.id) {
        return { ...contact, ...data };
      }
      return contact;
    });

    setSelectedContacts([...updatedContacts]);
  };

  return (
    <div className="overflow-y-auto max-h-[82vh] pr-1">
      <div className="grid gap-2 rounded-md p-2 overflow-y-auto overflow-x-hidden">
        {contacts.map((contact) => {
          return (
            <ContactCardInForm
              key={contact.id}
              contact={contact}
              onDelete={handleDeleteContact}
              updateContacts={updateContacts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ContactsList;
