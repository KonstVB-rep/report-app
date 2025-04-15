import React from "react";

import { BookUser } from "lucide-react";

import { ContactSchema } from "../../model/schema";
import CardInfo from "./CardInfo";

const ContactCardInDealInfo: React.FC<{ contact: ContactSchema }> = ({
  contact,
}) => {
  return (
    <div className="grid flex-1 rounded-md border border-solid">
      <div className="flex items-start justify-start gap-4 p-2">
        <BookUser size="32" strokeWidth={1} className="flex-shrink-0 pt-1" />

        <div className="text-md flex flex-col items-start justify-start">
          <CardInfo data={contact.name} title="Имя" />

          <CardInfo data={contact.phone} title="Телефон" type="phone" />

          <CardInfo data={contact.email} title="Email" type="email" />

          <CardInfo data={contact.position} title="Должность" />
        </div>
      </div>
    </div>
  );
};

export default ContactCardInDealInfo;
