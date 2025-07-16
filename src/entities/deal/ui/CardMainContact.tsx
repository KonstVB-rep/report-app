import React from "react";

import CardInfo from "./CardInfo";

const CardMainContact = ({
  contact,
  phone,
  email,
}: {
  contact: string;
  phone: string | null;
  email: string | null | undefined;
}) => {
  const fields: { label: string; value?: string | null }[] = [
    { label: "Имя", value: contact },
    { label: "Телефон", value: phone },
    { label: "Email", value: email },
  ];
  return (
    <div className="grid w-full">
      <div className="flex items-center justify-start gap-4">
        <div className="w-full flex flex-col items-start justify-start text-md gap-2">
          {fields.map(({ label, value }) => (
            <CardInfo
              key={label}
              data={value}
              classNameData="flex items-center gap-4"
              title={label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardMainContact;
