import React from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Contact } from "../types";

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
}

const ContactCardInForm: React.FC<ContactCardProps> = ({
  contact,
  onDelete,
}) => {
  return (
    <div className="flex items-start justify-between gap-2 p-2">
      <div className="grid w-full gap-1 rounded-md border border-solid p-2 text-sm [word-break:break-word]">
        {contact.name && (
          <p className="flex gap-1 items-center justify-start rounded-sm p-2 bg-black/20 dark:bg-black/50">
            <span className="font-bold text-sm inline-block first-letter:capitalize">
              имя:
            </span>
            <span className="capitalize">{contact.name}</span>
          </p>
        )}
        {contact.position && (
          <p className="flex gap-1 items-center justify-start rounded-sm p-2 bg-black/20 dark:bg-black/50">
            <span className="font-bold text-sm inline-block first-letter:capitalize">
              Должность:
            </span>
            {contact.position}
          </p>
        )}
        {contact.phone && (
          <p className="flex gap-1 items-center justify-start rounded-sm p-2 bg-black/20 dark:bg-black/50">
            <span className="font-bold text-sm inline-block first-letter:capitalize">
              телефон:
            </span>
            {contact.phone}
          </p>
        )}
        {contact.email && (
          <p className="flex gap-1 items-center justify-start rounded-sm p-2 bg-black/20 dark:bg-black/50">
            <span className="font-bold text-sm inline-block first-letter:capitalize">
              email:
            </span>
            {contact.email}
          </p>
        )}
      </div>

      <Button
        variant="destructive"
        onClick={() => onDelete(contact.id)}
        className="btn_hover"
        title="Удалить контакт"
      >
        <X />
      </Button>
    </div>
  );
};

export default ContactCardInForm;
