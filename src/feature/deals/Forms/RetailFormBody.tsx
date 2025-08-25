"use client";

import { useEffect } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import DatePickerFormField from "@/shared/custom-components/ui/Inputs/DatePickerFormField";
import InputNumberForm from "@/shared/custom-components/ui/Inputs/InputNumberForm";
import InputPhoneForm from "@/shared/custom-components/ui/Inputs/InputPhoneForm";
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/custom-components/ui/Overlay";
import SelectFormField from "@/shared/custom-components/ui/SelectForm/SelectFormField";
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr";

import ContactDeal from "../../contact/ui/ContactDeal";
import { Contact } from "@/entities/deal/types";
import useSendDealInfo from "../api/hooks/useSendDealInfo";
import { DirectionRetailLabels, DeliveryRetailLabels, StatusRetailLabels } from "../lib/constants";
import AddManagerToDeal from "../ui/Modals/AddManagerToDeal";

type RetailFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
  contactsKey?: keyof T;
  managerId: string | undefined;
  titleForm: string;
};

const directionOptions = transformObjValueToArr(DirectionRetailLabels);
const deliveryOptions = transformObjValueToArr(DeliveryRetailLabels);
const statusOptions = transformObjValueToArr(StatusRetailLabels);

const RetailFormBody = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
  contactsKey,
  managerId = "",
  titleForm,
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
    managers,
    setManagers,
    firstManager,
    setFirstManager,
  } = useSendDealInfo<T>(
    onSubmit,
    managerId,
    form.getValues("contacts" as Path<T>)
  );

  const { getValues } = form;

  useEffect(() => {
    const ids = getValues("managersIds" as Path<T>);
    if (ids?.length > 0) setManagers(ids);
  }, [getValues, setManagers]);

  const getError = (name: keyof T) =>
    form.formState.errors[name]?.message as string;

  return (
    <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`grid max-h-[82vh] min-w-full gap-5 overflow-y-auto transform duration-150 ${isAddContact ? "-translate-x-full" : "translate-x-0"}`}
        >
          <div className="text-center font-semibold uppercase">{titleForm}</div>
          <div className="grid gap-2 p-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <DatePickerFormField
                name={"dateRequest" as Path<T>}
                label="Дата запроса"
                control={form.control}
                errorMessage={getError("dateRequest")}
              />

              <InputTextForm
                name={"nameDeal" as Path<T>}
                label="Название сделки"
                control={form.control}
                errorMessage={getError("nameDeal")}
                required
                placeholder="Название..."
              />

              <InputTextForm
                name={"nameObject" as Path<T>}
                label="Название объекта/Город"
                control={form.control}
                errorMessage={getError("nameObject")}
                required
                placeholder="Название..."
              />

              <SelectFormField
                name={"direction" as Path<T>}
                label="Направление"
                control={form.control}
                errorMessage={getError("direction")}
                options={directionOptions}
                placeholder="Выберите направление"
                required
              />

              <SelectFormField
                name={"deliveryType" as Path<T>}
                label="Тип поставки"
                control={form.control}
                errorMessage={getError("deliveryType")}
                options={deliveryOptions}
                placeholder="Выберите тип поставки"
              />

              <InputTextForm
                name={"contact" as Path<T>}
                label="Контакты"
                control={form.control}
                errorMessage={getError("contact")}
                required
                placeholder="Имя контакта"
              />

              <InputPhoneForm
                name={"phone" as Path<T>}
                label="Телефон"
                control={form.control}
                errorMessage={getError("phone")}
                placeholder="Введите телефон пользователя"
              />
            </div>

            <div className="flex flex-col gap-1">
              <InputTextForm
                name={"email" as Path<T>}
                label="Email"
                type="email"
                control={form.control}
                errorMessage={getError("email")}
                className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500"
              />

              <InputNumberForm
                name={"amountCP" as Path<T>}
                label="Сумма КП"
                control={form.control}
                errorMessage={getError("amountCP")}
                placeholder="Сумма КП"
              />

              <InputNumberForm
                name={"delta" as Path<T>}
                label="Дельта"
                control={form.control}
                errorMessage={getError("delta")}
                placeholder="Дельта"
              />

              <SelectFormField
                name={"dealStatus" as Path<T>}
                label="Статус КП"
                control={form.control}
                errorMessage={getError("dealStatus")}
                options={statusOptions}
                placeholder="Выберите статус КП"
              />

              <DatePickerFormField
                name={"plannedDateConnection" as Path<T>}
                label="Планируемый контакт"
                control={form.control}
                errorMessage={getError("plannedDateConnection")}
              />

              <InputTextForm
                name={"resource" as Path<T>}
                label="Источник"
                control={form.control}
                errorMessage={getError("resource")}
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
                    {getError("comments") && (
                      <FormMessage className="text-red-500">
                        {getError("comments")}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={toggleAddContact}
                size={isAddContact ? "icon" : undefined}
              >
                {isAddContact ? <ArrowLeft /> : "Добавить доп.контакт"}
              </Button>

              <AddManagerToDeal
                setManagers={setManagers}
                managers={managers}
                firstManager={firstManager}
                setFirstManager={setFirstManager}
              />
            </div>

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
