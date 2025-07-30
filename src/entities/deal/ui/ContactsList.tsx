import React from "react";

import { Contact } from "../types";
import ContactCardInForm from "./ContactCardInForm";

type ContactsListProps = {
  contacts: Contact[] | [];
  handleDeleteContact: (id: string) => void;
};

const ContactsList = ({ contacts, handleDeleteContact }: ContactsListProps) => {
  if (contacts.length === 0) {
    return null;
  }
  return (
    <div className="overflow-y-auto max-h-[82vh] pr-1">
      <div className="grid gap-2 rounded-md p-2 overflow-y-auto overflow-x-hidden">
        {contacts.map((contact) => {
          return (
            <ContactCardInForm
              key={contact.id}
              contact={contact}
              onDelete={handleDeleteContact}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ContactsList;
