"use client";

import React, { useEffect } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { transformObjValueToArr } from "@/shared/lib/helpers";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DatePickerFormField from "@/shared/ui/Inputs/DatePickerFormField";
import InputNumberForm from "@/shared/ui/Inputs/InputNumberForm";
import InputPhoneForm from "@/shared/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import Overlay from "@/shared/ui/Overlay";
import SelectFormField from "@/shared/ui/SelectForm/SelectFormField";

import useSendDealInfo from "../../hooks/useSendDealInfo";
import {
  DeliveryRetailLabels,
  DirectionRetailLabels,
  StatusRetailLabels,
} from "../../lib/constants";
import ContactDeal from "../Modals/ContactDeal";

type RetailFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
  contactsKey?: keyof T;
};

const RetailFormBody = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
  contactsKey,
}: RetailFormBodyProps<T>) => {
  const {
    contacts,
    setContacts,
    selectedContacts,
    setSelectedContacts,
    handleDeleteContact,
    handleSubmit,
    isAddContact,
    toggleAddContact,
  } = useSendDealInfo<T>(onSubmit);

  const currentContacts = form.getValues(contactsKey as Path<T>);

  useEffect(() => {
    if (contactsKey) {
      const contacts = form.getValues(contactsKey as Path<T>);
      setContacts(contacts);
    }
  }, [contactsKey, form, currentContacts, setContacts]);

  return (
    <div className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`grid max-h-[82vh] min-w-full gap-5 overflow-y-auto trаnsform duration-150 ${isAddContact ? "-translate-x-full" : "translate-x-0"}`}
        >
          <div className="text-center font-semibold uppercase">
            Форма добавления розничной сделки
          </div>
          <div className="grid gap-2">
            <div className="grid gap-2 p-2 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <DatePickerFormField<UseFormReturn<T>>
                  name={"dateRequest" as Path<T>}
                  label="Дата запроса"
                  control={form.control}
                  errorMessage={
                    form.formState.errors.dateRequest?.message as string
                  }
                />

                <InputTextForm
                  name={"nameDeal" as Path<T>}
                  label="Название сделки"
                  control={form.control}
                  errorMessage={
                    form.formState.errors.nameDeal?.message as string
                  }
                  placeholder="Название..."
                  required
                />

                <InputTextForm
                  name={"nameObject" as Path<T>}
                  label="Название объекта/Город"
                  control={form.control}
                  errorMessage={
                    form.formState.errors.nameObject?.message as string
                  }
                  placeholder="Название..."
                  required
                />

                <SelectFormField<UseFormReturn<T>>
                  name={"direction" as Path<T>}
                  label="Направление"
                  control={form.control}
                  errorMessage={form.formState.errors.department?.message}
                  options={transformObjValueToArr(DirectionRetailLabels)}
                  placeholder="Выберите направление"
                  onValueChange={(selected) => {
                    if (selected) {
                      return form.setValue(
                        "direction" as Path<T>,
                        selected as PathValue<T, Path<T>>
                      );
                    }
                  }}
                  required
                />

                <SelectFormField<UseFormReturn<T>>
                  name={"deliveryType" as Path<T>}
                  label="Тип поставки"
                  control={form.control}
                  errorMessage={form.formState.errors.department?.message}
                  options={transformObjValueToArr(DeliveryRetailLabels)}
                  placeholder="Выберите тип поставки"
                  onValueChange={(selected) => {
                    if (selected) {
                      return form.setValue(
                        "deliveryType" as Path<T>,
                        selected as PathValue<T, Path<T>>
                      );
                    }
                  }}
                />

                <InputTextForm
                  name={"contact" as Path<T>}
                  label="Контакты"
                  control={form.control}
                  errorMessage={form.formState.errors.contact?.message}
                  placeholder="Имя контакта"
                  required
                />

                <InputPhoneForm
                  name="phone"
                  label="Телефон"
                  control={form.control}
                  errorMessage={form.formState.errors.phone?.message}
                  placeholder="Введите телефон пользователя"
                />
              </div>

              <div className="flex flex-col gap-1">
                <InputTextForm
                  name={"email" as Path<T>}
                  label="Email"
                  control={form.control}
                  errorMessage={form.formState.errors.email?.message}
                  className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500"
                  type="email"
                />

                <InputNumberForm
                  name={"amountCP" as Path<T>}
                  label="Сумма КП"
                  control={form.control}
                  errorMessage={form.formState.errors.amountCP?.message}
                  placeholder="Сумма КП"
                />

                <InputNumberForm
                  name={"delta" as Path<T>}
                  label="Дельта"
                  control={form.control}
                  errorMessage={form.formState.errors.amountCP?.message}
                  placeholder="Дельта"
                />

                <SelectFormField<UseFormReturn<T>>
                  name={"dealStatus" as Path<T>}
                  label="Статус КП"
                  control={form.control}
                  errorMessage={form.formState.errors.dealStatus?.message}
                  options={transformObjValueToArr(StatusRetailLabels)}
                  placeholder="Выберите статус КП"
                  onValueChange={(selected) => {
                    if (selected) {
                      return form.setValue(
                        "dealStatus" as Path<T>,
                        selected as PathValue<T, Path<T>>
                      );
                    }
                  }}
                />

                <DatePickerFormField<UseFormReturn<T>>
                  name={"plannedDateConnection" as Path<T>}
                  label="Планируемый контакт"
                  control={form.control}
                  errorMessage={
                    form.formState.errors.plannedDateConnection
                      ?.message as string
                  }
                />

                <InputTextForm
                  name={"resource" as Path<T>}
                  label="Источник"
                  control={form.control}
                  errorMessage={form.formState.errors.resource?.message}
                  placeholder="Откуда пришёл клиент"
                  required
                />

                <FormField
                  control={form.control}
                  name={"comments" as Path<T>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Примечание / Комментарии</FormLabel>

                      <FormControl>
                        <Textarea
                          placeholder="Введите комментарии"
                          required
                          {...field}
                        />
                      </FormControl>

                      {form.formState.errors.comments?.message && (
                        <FormMessage className="text-red-500">
                          {form.formState.errors.comments?.message as string}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {isAddContact ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleAddContact}
                  size="icon"
                >
                  <ArrowLeft />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleAddContact}
                >
                  Добавить доп.контакт
                </Button>
              )}
              <SubmitFormButton
                title="Сохранить"
                isPending={isPending}
                className="ml-auto mr-2 w-max"
              />
            </div>
          </div>
        </form>
        <div
          className={`min-w-full flex flex-col gap-2 trаnsform ${isAddContact ? "-translate-x-full" : "translate-x-0"} duration-150`}
        >
          <Button
            type="button"
            variant="outline"
            onClick={toggleAddContact}
            size="icon"
          >
            <ArrowLeft />
          </Button>
          <ContactDeal
            onContactsChange={setContacts}
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
            contacts={contacts as T[typeof contactsKey]}
            contactsKey={contactsKey}
            handleDeleteContact={handleDeleteContact}
          />
        </div>
      </Form>
    </div>
  );
};

export default RetailFormBody;
