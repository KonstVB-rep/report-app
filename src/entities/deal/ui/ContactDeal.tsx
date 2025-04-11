"use client";
import React from "react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputEmail from "@/shared/ui/Inputs/InputEmail";
import PhoneInput from "@/shared/ui/PhoneInput";
import { X, Plus } from "lucide-react";
import { ContactSchema } from "../model/schema";
import DialogComponent from "@/shared/ui/DialogComponent";
import useAddContactToDeal from "../hooks/useAddContactToDeal";

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
      trigger={
        <Button variant="outline" className="flex w-fit gap-2 p-2">
          <Plus />
          Добавить контакт
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative rounded border p-4">
              <FormField
                control={form.control}
                name={`contacts.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input placeholder="Имя контакта" {...field} />
                    </FormControl>
                    {form.formState.errors.contacts?.[index]?.name?.message && (
                      <FormMessage className="text-red-500">
                        {
                          form.formState.errors.contacts?.[index]?.name
                            ?.message as string
                        }
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`contacts.${index}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input placeholder="Должность" {...field} value={field.value ?? ''}/>
                    </FormControl>
                    {form.formState.errors.contacts?.[index]?.position
                      ?.message && (
                      <FormMessage className="text-red-500">
                        {
                          form.formState.errors.contacts?.[index]?.position
                            ?.message as string
                        }
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`contacts.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="Телефон"
                        onAccept={field.onChange}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    {(
                      form.formState.errors.contacts?.[
                        index
                      ] as ContactFieldError
                    )?._common?.message && (
                      <FormMessage className="text-red-500">
                        {
                          (
                            form.formState.errors.contacts?.[
                              index
                            ] as ContactFieldError
                          )?._common?.message as string
                        }
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`contacts.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <InputEmail {...field} value={field.value ?? ''}/>
                    </FormControl>
                    {(
                      form.formState.errors.contacts?.[
                        index
                      ] as ContactFieldError
                    )?._common?.message && (
                      <FormMessage className="text-red-500">
                        {
                          (
                            form.formState.errors.contacts?.[
                              index
                            ] as ContactFieldError
                          )?._common?.message as string
                        }
                      </FormMessage>
                    )}
                  </FormItem>
                )}
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
