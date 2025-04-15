import React from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Contact } from "../types";

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
  index: number;
}

const ContactCardInForm: React.FC<ContactCardProps> = ({
  contact,
  onDelete,
  index,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 px-2">
      <div className="flex w-full items-center justify-start gap-2">
        <p className="flex h-8 w-8 items-center justify-center rounded-md bg-muted p-1 text-sm">
          {index + 1}{" "}
        </p>
        <div className="flex w-full gap-1 rounded-md border border-solid p-2 text-sm">
          <p>{contact.name}</p>
          <p>{contact.phone}</p>
          <p>{contact.email}</p>
          <p>{contact.position}</p>
        </div>
      </div>
      <Button
        variant="destructive"
        onClick={() => onDelete(contact.id)}
        className="contact-card__delete-btn"
      >
        <X />
      </Button>
    </div>
  );
};

export default ContactCardInForm;
