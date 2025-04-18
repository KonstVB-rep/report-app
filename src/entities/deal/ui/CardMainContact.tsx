import React from "react";
import CardInfo from "./CardInfo";

const CardMainContact = ({contact, phone, email}: {contact: string, phone: string | null, email: string | null | undefined}) => {
  return (
    <div className="grid w-full"> 
      <div className="flex items-center justify-start gap-4">

        <div className="w-full flex flex-col items-start justify-start text-md gap-2">
          <CardInfo data={contact} title="Имя" classNameData="flex items-center gap-4"/>

          <CardInfo data={phone} title="Телефон" type="phone" classNameData="flex items-center gap-4"/>

          <CardInfo data={email} title="Email" type="email" classNameData="flex items-center gap-4"/>
        </div>
      </div>
    </div>
  );
};

export default CardMainContact;
