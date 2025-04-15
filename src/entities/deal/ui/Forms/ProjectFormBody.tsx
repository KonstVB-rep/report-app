import React, { useEffect } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
  useWatch,
} from "react-hook-form";

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
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusProjectLabels,
} from "../../lib/constants";
import ContactsList from "../ContactsList";
import ContactDeal from "../Modals/ContactDeal";

export const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;
  const cleanedValue = value.replace(/\s+/g, "").replace(",", ".");
  return parseFloat(cleanedValue) || 0;
};

export const formatNumber = (value: number): string => {
  if (isNaN(value)) return "0,00";
  if (value <= 0) return "0,00";
  return value
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
};

type ProjectFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
  contactsKey?: keyof T;
};

const ProjectFormBody = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
  contactsKey,
}: ProjectFormBodyProps<T>) => {
  const { contacts, setContacts, handleDeleteContact, handleSubmit } =
    useSendDealInfo<T>(onSubmit);

  const currentContacts = form.getValues(contactsKey as Path<T>);

  const watchedValues = useWatch({
    control: form.control,
    name: ["amountCP", "amountWork", "amountPurchase"] as Path<T>[],
  });

  React.useEffect(() => {
    if (!watchedValues) return;

    const [amountCP = "0", amountWork = "0", amountPurchase = "0"] =
      watchedValues || [];
    const parsedAmountCP = parseFormattedNumber(amountCP);
    const parsedAmountWork = parseFormattedNumber(amountWork);
    const parsedAmountPurchase = parseFormattedNumber(amountPurchase);

    if (
      isNaN(parsedAmountCP) ||
      isNaN(parsedAmountWork) ||
      isNaN(parsedAmountPurchase)
    )
      return;

    if (
      parsedAmountCP === 0 ||
      parsedAmountWork === 0 ||
      parsedAmountPurchase === 0
    )
      return;

    const calculatedDelta =
      parsedAmountCP - parsedAmountWork - parsedAmountPurchase;

    form.setValue(
      "delta" as Path<T>,
      formatNumber(calculatedDelta) as PathValue<T, Path<T>>,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  }, [form, watchedValues]);

  useEffect(() => {
    if (contactsKey) {
      const contacts = form.getValues(contactsKey as Path<T>);
      setContacts(contacts);
    }
  }, [contactsKey, form, currentContacts, setContacts]);

  return (
    <div className="max-h-[82vh] overflow-y-auto">
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid max-h-[82vh] gap-5 overflow-y-auto"
        >
          <div className="text-center font-semibold uppercase">
            Форма добавления проекта
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
                  options={transformObjValueToArr(DirectionProjectLabels)}
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
                  options={transformObjValueToArr(DeliveryProjectLabels)}
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

                <InputTextForm
                  name={"email" as Path<T>}
                  label="Email"
                  control={form.control}
                  errorMessage={form.formState.errors.email?.message}
                  className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500"
                  type="email"
                />
              </div>

              <div className="flex flex-col gap-1">
                <InputNumberForm
                  name={"amountCP" as Path<T>}
                  label="Сумма КП"
                  control={form.control}
                  errorMessage={form.formState.errors.amountCP?.message}
                  placeholder="Сумма КП"
                />

                <InputNumberForm
                  name={"amountWork" as Path<T>}
                  label="Сумма работ"
                  control={form.control}
                  errorMessage={form.formState.errors.amountWork?.message}
                  placeholder="Сумма работ"
                />

                <InputNumberForm
                  name={"amountPurchase" as Path<T>}
                  label="Сумма закупки"
                  control={form.control}
                  errorMessage={form.formState.errors.amountPurchase?.message}
                  placeholder="Сумма закупки"
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
                  options={transformObjValueToArr(StatusProjectLabels)}
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
                  required
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
            <SubmitFormButton
              title="Сохранить"
              isPending={isPending}
              className="ml-auto mr-2 w-max"
            />
          </div>
        </form>
        <ContactDeal onContactsChange={setContacts} contacts={contacts} />
        {contactsKey && (
          <ContactsList
            contacts={contacts as T[typeof contactsKey]}
            handleDeleteContact={handleDeleteContact}
          />
        )}
      </Form>
    </div>
  );
};

export default ProjectFormBody;
