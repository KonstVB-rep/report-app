import { useCallback, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

import { useParams } from "next/navigation";

import { Contact } from "../types";

const useSendDealInfo = <T extends FieldValues>(
  onSubmit: (data: T) => void,
  managerId: string
) => {
  const { userId } = useParams();

  const firstManagerId = managerId || userId;

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [managers, setManagers] = useState<{ userId: string }[]>([
    { userId: firstManagerId as string },
  ]);
  const [firstManager, setFirstManager] = useState<string>("");
  const [selectedContacts, setSelectedContacts] = useState<
    Contact[]
  >([]);
  const [isAddContact, setIsAddContact] = useState(false);

  const handleDeleteContact = useCallback((id: string) => {
    setSelectedContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== id)
    );
  }, []);

  const toggleAddContact = () => {
    setIsAddContact((prev) => !prev);
  };

  const handleSubmit = (data: T) => {
    const fullData = {
      ...data,
      userId: firstManager,
      contacts: selectedContacts,
      managersIds: managers,
    };
    onSubmit(fullData);
  };

  useEffect(() => {
    setFirstManager(firstManagerId as string);
  }, [firstManagerId]);

  return {
    contacts,
    setContacts,
    selectedContacts,
    setSelectedContacts,
    handleDeleteContact,
    handleSubmit,
    isAddContact,
    toggleAddContact,
    setManagers,
    managers,
    firstManager,
    setFirstManager,
  };
};

export default useSendDealInfo;
