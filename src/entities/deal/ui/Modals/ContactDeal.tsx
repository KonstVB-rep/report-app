"use client";

import React from "react";

import dynamic from "next/dynamic";

import { Plus, X } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import DialogComponent from "@/shared/ui/DialogComponent";


import useAddContactToDeal from "../../hooks/useAddContactToDeal";
import { ContactSchema } from "../../model/schema";
import { Contact } from "../../types";
import InputPhoneForm from "@/shared/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";

const ContactsList = dynamic(() => import("../ContactsList"), { ssr: false });

type ContactFieldError = {
  _common?: {
    message?: string;
  };
};

type ContactDealProps = {
  contacts: Contact[] | [];
  onContactsChange: (contacts: ContactSchema["contacts"]) => void;
  contactsKey: string | null | undefined;
  handleDeleteContact: (id: string) => void;
  selectedContacts: Contact[] | [];
  setSelectedContacts: (contacts: ContactSchema["contacts"]) => void;
};

const ContactDeal = ({
  contacts = [],
  onContactsChange,
  handleDeleteContact,
  contactsKey,
  selectedContacts,
  setSelectedContacts,
}: ContactDealProps) => {
  const {
    form,
    handleRemove,
    handleAddNewContactForm,
    handleRemoveAll,
    fields,
  } = useAddContactToDeal(contacts, onContactsChange);

  const onSubmit = (data: ContactSchema) => {
    setSelectedContacts([...selectedContacts, ...data.contacts]);
    handleRemoveAll();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
        <div className="grid gap-2 overflow-y-auto max-h-[60vh] pr-2 box-border">
          {fields.map((field, index: number) => (
            <motion.div
              key={form.watch(`contacts.${index}.id`)}
              className="grid gap-2 rounded border p-4"
            >
              <div className="max-h-full overflow-hidden p-[2px]">
                <InputTextForm
                  name={`contacts.${index}.name`}
                  label=""
                  control={form.control}
                  errorMessage={
                    form.formState.errors.contacts?.[index]?.name?.message
                  }
                  placeholder="Имя"
                />

                <InputTextForm
                  name={`contacts.${index}.position`}
                  label=""
                  control={form.control}
                  errorMessage={
                    form.formState.errors.contacts?.[index]?.position?.message
                  }
                  placeholder="Должность"
                />

                <InputPhoneForm
                  name={`contacts.${index}.phone`}
                  label=""
                  control={form.control}
                  errorMessage={
                    (
                      form.formState.errors.contacts?.[
                        index
                      ] as ContactFieldError
                    )?._common?.message
                  }
                  placeholder="Телефон"
                />

                <InputTextForm
                  name={`contacts.${index}.email`}
                  label=""
                  control={form.control}
                  errorMessage={
                    (
                      form.formState.errors.contacts?.[
                        index
                      ] as ContactFieldError
                    )?._common?.message
                  }
                  className="w-full valid:[&:not(:placeholder-shown)]:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                  placeholder="Email"
                  type="email"
                />
              </div>

              {(fields.length > 1 || field.name) && (
                <Button
                  type="button"
                  onClick={() => handleRemove(index)}
                  variant="destructive"
                  className="w-fit flex items-center justify-center ml-auto"
                >
                  <X className="h-4 w-4" /> Удалить
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col justify-start gap-2">
          <div className="flex gap-2 p-2 pt-4">
            <Button
              type="button"
              onClick={handleAddNewContactForm}
              size="icon"
              className="flex items-center justify-center shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button
              type="submit"
              className="active:scale-95 transition-transform duration-150"
            >
              Сохранить
            </Button>
          </div>
          {selectedContacts.length > 0 && (
            <DialogComponent
              dialogTitle="Контакты"
              classNameContent="sm:max-w-[600px] max-h-[82vh] overflow-y-auto"
              trigger={
                <Button
                  variant="outline"
                  className="!relative flex w-fit gap-2 p-2"
                >
                  Дополнительные контакты
                  <span className="absolute -top-2 -right-2 p-[2px] dark:bg-black border border-solid border-primary rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedContacts.length}
                  </span>
                </Button>
              }
            >
              {contactsKey && (
                <ContactsList
                  contacts={selectedContacts}
                  handleDeleteContact={handleDeleteContact}
                />
              )}
            </DialogComponent>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ContactDeal;
