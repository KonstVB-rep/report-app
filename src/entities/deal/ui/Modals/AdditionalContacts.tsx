import React, { useEffect, useRef, useState } from "react";

import { useGetAdditionalContacts } from "../../hooks/query";
import { Contact } from "../../types";

const AdditionalContacts = ({ dealId }: { dealId: string }) => {

  const [showEmptyNote, setShowEmptyNote] = useState(true);

  const {
    data: additionalContacts,
    isPending,
    isError,
  } = useGetAdditionalContacts(dealId);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!additionalContacts?.length) {
      timerRef.current = setTimeout(() => {
        setShowEmptyNote(false);
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [additionalContacts]);

  if (!additionalContacts) return null;

  if (isPending) {
    return (
      <div className="animate-pulse text-center text-muted-foreground">
        Загрузка дополнительных контактов...
      </div>
    );
  }
  if (isError) {
    return <div className="text-center">Произошла ошибка при загрузке дополнительных контактов</div>;
  }

  if (!additionalContacts.length && showEmptyNote) {
    return <div className="text-center">Нет дополнительных контактов</div>;
  }

  if (!additionalContacts.length && !showEmptyNote) return null;

  return (
    <div className="relative">
      <p className="pb-2">Дополнительные контакты:</p>
      {additionalContacts.map((contact: Contact) => (
        <div
          key={contact.id}
          className="grid py-2 space-y-2 max-h-[490px] overflow-auto pr-2"
        >
          <ul className="p-2 border rounded-md bg-background">
            <li>Имя: {contact.name}</li>
            {contact.position && <li>Должность: {contact.position}</li>}
            {contact.phone && <li>Телефон: {contact.phone}</li>}
            {contact.email && <li>Email: {contact.email}</li>}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdditionalContacts;
