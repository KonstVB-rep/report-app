"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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


type ContactFieldError = {
  _common?: {
    message?: string;
  };
};

const ContactSchema = z
  .object({
    id: z.string(),
    name: z
      .string()
      .min(1, "Контакт обязателен")
      .min(3, "Имя должно быть больше 3 символов"),
    phone: z.string().optional(),
    email: z.string().optional(),
    position: z.string().optional(),
  })
  .refine((data) => !!data.phone || !!data.email, {
    message: "Нужно указать хотя бы телефон или email",
    path: ["_common"],
  });

const FormSchema = z.object({
  contacts: z.array(ContactSchema).min(1, "Хотя бы один контакт обязателен"),
});

type FormData = z.infer<typeof FormSchema>;
type ContactDealProps = {
  onContactsChange: (contacts: FormData["contacts"]) => void;
};

const ContactDeal = ({ onContactsChange }: ContactDealProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contacts: [
        {
          id: crypto.randomUUID(),
          name: "",
          phone: "",
          email: "",
          position: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const onSubmit = (data: FormData) => {
    console.log("Отправка формы:", data);
    onContactsChange(data.contacts);
  };

  return (
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
                    <Input placeholder="Должность" {...field} />
                  </FormControl>
                  {form.formState.errors.contacts?.[index]?.position?.message && (
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
                    />
                  </FormControl>
                  {(form.formState.errors.contacts?.[index] as ContactFieldError)?._common?.message && (
                    <FormMessage className="text-red-500">
                      {
                        (form.formState.errors.contacts?.[index] as ContactFieldError)?._common
                          ?.message as string
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
                    <InputEmail {...field} />
                  </FormControl>
                  {(form.formState.errors.contacts?.[index] as ContactFieldError)?._common?.message && (
                    <FormMessage className="text-red-500">
                      {
                        (form.formState.errors.contacts?.[index] as ContactFieldError)?._common
                          ?.message as string
                      }
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {fields.length > 1 && (
              <Button
                type="button"
                onClick={() => remove(index)}
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
          <Button
            type="button"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                name: "",
                phone: "",
                email: "",
                position: "",
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить контакт
          </Button>

          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactDeal;
