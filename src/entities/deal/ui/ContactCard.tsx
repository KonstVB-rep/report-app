import React from "react";
import { Contact } from "../types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
  index: number;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onDelete,
  index,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 px-2">
      <div className="flex items-center gap-2 justify-start w-full">
        <p>{index + 1}: </p>
        <div className="flex gap-1 border border-solid p-2 text-sm w-full rounded-md">
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

export default ContactCard;
