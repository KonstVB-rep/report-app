"use client";

import React from "react";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import DialogComponent from "@/shared/ui/DialogComponent";
import InputPhoneForm from "@/shared/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";

import useAddContactToDeal from "../../hooks/useAddContactToDeal";
import { ContactSchema } from "../../model/schema";

type ContactFieldError = {
  _common?: {
    message?: string;
  };
};

type ContactDealProps = {
  contacts?: ContactSchema["contacts"];
  onContactsChange: (contacts: ContactSchema["contacts"]) => void;
};

const ContactDeal = ({ contacts = [], onContactsChange }: ContactDealProps) => {
  const {
    isOpen,
    setIsOpen,
    form,
    handleRemove,
    handleAddNewContactForm,
    fields,
  } = useAddContactToDeal(contacts, onContactsChange);

  const onSubmit = (data: ContactSchema) => {
    onContactsChange(data.contacts);
    setIsOpen(false);
  };

  return (
    <DialogComponent
      open={isOpen}
      onOpenChange={setIsOpen}
      dialogTitle="Добавить контакты"
      classNameContent="sm:max-w-[600px] max-h-[82vh] overflow-y-auto"
      trigger={
        <Button variant="outline" className="flex w-fit gap-2 p-2">
          <Plus />
          Добавить контакт
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field, index: number) => (
            <div key={field.id} className="relative rounded border p-4">
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
                  (form.formState.errors.contacts?.[index] as ContactFieldError)
                    ?._common?.message
                }
                placeholder="Телефон"
              />

              <InputTextForm
                name={`contacts.${index}.email`}
                label=""
                control={form.control}
                errorMessage={
                  (form.formState.errors.contacts?.[index] as ContactFieldError)
                    ?._common?.message
                }
                className="w-full valid:[&:not(:placeholder-shown)]:border-green-500 invalid:[&:not(:placeholder-shown)]:border-red-500"
                placeholder="Email"
                type="email"
              />

              {(fields.length > 1 || field.name) && (
                <Button
                  type="button"
                  onClick={() => handleRemove(index)}
                  variant="destructive"
                  size="icon"
                  className="absolute -right-[12px] -top-[12px] flex items-center justify-center rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2">
            <Button type="button" onClick={handleAddNewContactForm}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить контакт
            </Button>

            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </Form>
    </DialogComponent>
  );
};

export default ContactDeal;
