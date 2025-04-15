import React from "react";

import { Contact } from "../types";
import ContactCardInForm from "./ContactCardInForm";

type ContactsListProps = {
  contacts: Contact[] | [];
  handleDeleteContact: (id: string) => void;
};

const ContactsList = ({ contacts, handleDeleteContact }: ContactsListProps) => {
  if (!contacts || contacts.length === 0) {
    return null;
  }
  return (
    <div className="p-2">
      <div className="grid gap-2 rounded-md border border-solid p-2">
        <p className="text-sm">Дополнительные контакты</p>
        {contacts &&
          contacts.length > 0 &&
          contacts.map((contact, index) => {
            return (
              <ContactCardInForm
                key={contact.id}
                index={index}
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
