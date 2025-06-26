import React from "react";

import { BookUser } from "lucide-react";

import { Contact } from "../types";
import CardInfo from "./CardInfo";

const ContactCardInDealInfo: React.FC<{ contact: Contact }> = ({ contact }) => {
  return (
    <div className="grid flex-1 rounded-md border border-solid">
      <div className="flex items-start justify-start gap-4 p-2">
        <BookUser size="32" strokeWidth={1} className="flex-shrink-0 pt-1" />

        <div className="text-md flex flex-col gap-2 items-start justify-start">
          <CardInfo
            data={contact.name}
            classNameData="flex flex-wrap"
            title="Имя"
          />

          <CardInfo
            data={contact.phone}
            classNameData="flex flex-wrap"
            title="Телефон"
            type="phone"
          />

          <CardInfo
            data={contact.email}
            classNameData="flex flex-wrap"
            title="Email"
            type="email"
          />

          <CardInfo
            data={contact.position}
            classNameData="flex flex-wrap"
            title="Должность"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactCardInDealInfo;
