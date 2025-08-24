import React from "react";

import { BookUser } from "lucide-react";

import { Contact } from "../../deal/types";
import CardInfo from "./CardInfo";

const ContactCardInDealInfo: React.FC<{ contact: Contact }> = ({ contact }) => {
  const fields: { label: string; value?: string | null }[] = [
    { label: "Имя", value: contact.name },
    { label: "Должность", value: contact.position },
    { label: "Телефон", value: contact.phone },
    { label: "Email", value: contact.email },
  ];

  return (
    <div className="grid flex-1 rounded-md border border-solid">
      <div className="flex items-start justify-start gap-4 p-2">
        <BookUser size="32" strokeWidth={1} className="flex-shrink-0 pt-1" />

        <div className="text-md flex flex-col gap-2 items-start justify-start">
          {fields
            .filter(({ value }) => value)
            .map(({ label, value }) => (
              <CardInfo
                key={label}
                data={value}
                classNameData="flex flex-wrap"
                title={label}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ContactCardInDealInfo;
