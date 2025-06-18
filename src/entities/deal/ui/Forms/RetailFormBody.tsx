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
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DatePickerFormField from "@/shared/ui/Inputs/DatePickerFormField";
import InputNumberForm from "@/shared/ui/Inputs/InputNumberForm";
import InputPhoneForm from "@/shared/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";
import SelectFormField from "@/shared/ui/SelectForm/SelectFormField";

import useSendDealInfo from "../../hooks/useSendDealInfo";
import {
  DeliveryRetailLabels,
  DirectionRetailLabels,
  StatusRetailLabels,
} from "../../lib/constants";
import { Contact } from "../../types";
import ContactDeal from "../Modals/ContactDeal";

type RetailFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
  contactsKey?: keyof T;
};

const setSelectValue = <T extends FieldValues>(
  form: UseFormReturn<T>,
  name: keyof T,
  selected: unknown
) => {
  if (selected) {
    form.setValue(name as Path<T>, selected as PathValue<T, Path<T>>);
  }
};

const directionOptions = transformObjValueToArr(DirectionRetailLabels);
const deliveryOptions = transformObjValueToArr(DeliveryRetailLabels);
const statusOptions = transformObjValueToArr(StatusRetailLabels);

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

  console.log(statusOptions, 'statusOptions')

  useEffect(() => {
    if (contactsKey) {
      const value = form.getValues(contactsKey as Path<T>);
      setContacts(value);
    }
  }, [contactsKey, form, setContacts, currentContacts]);

  const error = (name: keyof T) =>
    form.formState.errors[name]?.message as string;

  return (
    <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`grid max-h-[82vh] min-w-full gap-5 overflow-y-auto transform duration-150 ${isAddContact ? "-translate-x-full" : "translate-x-0"}`}
        >
          <div className="text-center font-semibold uppercase">
            Форма добавления розничной сделки
          </div>
          <div className="grid gap-2 p-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <DatePickerFormField
                name={"dateRequest" as Path<T>}
                label="Дата запроса"
                control={form.control}
                errorMessage={error("dateRequest")}
              />

              <InputTextForm
                name={"nameDeal" as Path<T>}
                label="Название сделки"
                control={form.control}
                errorMessage={error("nameDeal")}
                required
                placeholder="Название..."
              />

              <InputTextForm
                name={"nameObject" as Path<T>}
                label="Название объекта/Город"
                control={form.control}
                errorMessage={error("nameObject")}
                required
                placeholder="Название..."
              />

              <SelectFormField
                name={"direction" as Path<T>}
                label="Направление"
                control={form.control}
                errorMessage={error("direction")}
                options={directionOptions}
                placeholder="Выберите направление"
                onValueChange={(selected) =>
                  setSelectValue(form, "direction", selected)
                }
                required
              />

              <SelectFormField
                name={"deliveryType" as Path<T>}
                label="Тип поставки"
                control={form.control}
                errorMessage={error("deliveryType")}
                options={deliveryOptions}
                placeholder="Выберите тип поставки"
                onValueChange={(selected) =>
                  setSelectValue(form, "deliveryType", selected)
                }
              />

              <InputTextForm
                name={"contact" as Path<T>}
                label="Контакты"
                control={form.control}
                errorMessage={error("contact")}
                required
                placeholder="Имя контакта"
              />

              <InputPhoneForm
                name={"phone" as Path<T>}
                label="Телефон"
                control={form.control}
                errorMessage={error("phone")}
                placeholder="Введите телефон пользователя"
              />
            </div>

            <div className="flex flex-col gap-1">
              <InputTextForm
                name={"email" as Path<T>}
                label="Email"
                type="email"
                control={form.control}
                errorMessage={error("email")}
                className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500"
              />

              <InputNumberForm
                name={"amountCP" as Path<T>}
                label="Сумма КП"
                control={form.control}
                errorMessage={error("amountCP")}
                placeholder="Сумма КП"
              />

              <InputNumberForm
                name={"delta" as Path<T>}
                label="Дельта"
                control={form.control}
                errorMessage={error("delta")}
                placeholder="Дельта"
              />

              <SelectFormField
                name={"dealStatus" as Path<T>}
                label="Статус КП"
                control={form.control}
                errorMessage={error("dealStatus")}
                options={statusOptions}
                placeholder="Выберите статус КП"
                onValueChange={(selected) =>
                  setSelectValue(form, "dealStatus", selected)
                }
              />

              <DatePickerFormField
                name={"plannedDateConnection" as Path<T>}
                label="Планируемый контакт"
                control={form.control}
                errorMessage={error("plannedDateConnection")}
              />

              <InputTextForm
                name={"resource" as Path<T>}
                label="Источник"
                control={form.control}
                errorMessage={error("resource")}
                required
                placeholder="Откуда пришёл клиент"
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
                    {error("comments") && (
                      <FormMessage className="text-red-500">
                        {error("comments")}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={toggleAddContact}
              size={isAddContact ? "icon" : undefined}
            >
              {isAddContact ? <ArrowLeft /> : "Добавить доп.контакт"}
            </Button>
            <SubmitFormButton
              title="Сохранить"
              isPending={isPending}
              className="ml-auto mr-2 w-max"
            />
          </div>
        </form>

        <div
          className={`min-w-full flex flex-col gap-2 transform duration-150 ${isAddContact ? "-translate-x-full" : "translate-x-0"}`}
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
            selectedContacts={selectedContacts as Contact[]}
            setSelectedContacts={setSelectedContacts}
            contacts={contactsKey ? (contacts as T[typeof contactsKey]) : []}
            contactsKey={contactsKey as string}
            handleDeleteContact={handleDeleteContact}
          />
        </div>
      </Form>
    </MotionDivY>
  );
};

export default RetailFormBody;
