import React from "react";
import { Contact } from "../types";
import ContactCard from "./ContactCard";

type ContactsListProps = {
  contacts: Contact[];
  handleDeleteContact: (id: string) => void;
};

const ContactsList = ({ contacts, handleDeleteContact }: ContactsListProps) => {
  return (
    <div className="grid gap-2 p-2">
      {contacts.length > 0 &&
        contacts.map((contact, index) => {
          return (
            <ContactCard
              key={contact.id}
              index={index}
              contact={contact}
              onDelete={handleDeleteContact}
            />
          );
        })}
    </div>
  );
};

export default ContactsList;
