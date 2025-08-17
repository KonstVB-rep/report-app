import React from "react";

import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { Contact } from "../types";

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
}

const ContactCardInForm: React.FC<ContactCardProps> = ({
  contact,
  onDelete,
}) => {
  const fields: { label: string; value?: string | null }[] = [
    { label: "Имя", value: contact.name },
    { label: "Должность", value: contact.position },
    { label: "Телефон", value: contact.phone },
    { label: "Email", value: contact.email },
  ];

  return (
    <div className="flex items-start justify-between gap-2 p-2">
      <div className="grid w-full gap-1 rounded-md border border-solid p-2 text-sm [word-break:break-word]">
        {fields
          .filter(({ value }) => value)
          .map(({ label, value }) => (
            <p
              key={label}
              className="flex items-center gap-1 rounded-sm bg-black/20 p-2 dark:bg-black/50"
            >
              <span className="font-bold first-letter:capitalize">
                {label}:
              </span>
              <span className="capitalize">{value}</span>
            </p>
          ))}
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
