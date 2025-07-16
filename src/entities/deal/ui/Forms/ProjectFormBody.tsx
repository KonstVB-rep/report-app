"use client";

import { useEffect } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
  useWatch,
} from "react-hook-form";

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
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusProjectLabels,
} from "../../lib/constants";
import { formatNumber, parseFormattedNumber } from "../../lib/helpers";
import AddManagerToDeal from "../Modals/AddManagerToDeal";
import ContactDeal from "../Modals/ContactDeal";

type ProjectFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
  contactsKey?: keyof T;
  managerId: string | undefined;
};

const directionOptions = transformObjValueToArr(DirectionProjectLabels);
const deliveryOptions = transformObjValueToArr(DeliveryProjectLabels);
const statusOptions = transformObjValueToArr(StatusProjectLabels);

const ProjectFormBody = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
  contactsKey,
  managerId = "",
}: ProjectFormBodyProps<T>) => {
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
  } = useSendDealInfo<T>(onSubmit, managerId);

  const watchedValues = useWatch({
    control: form.control,
    name: ["amountCP", "amountWork", "amountPurchase"] as Path<T>[],
  });

  const { getValues } = form;

  useEffect(() => {
    const ids = getValues("managersIds" as Path<T>);
    if (ids?.length > 0) setManagers(ids);
  }, [getValues, setManagers]);

  useEffect(() => {
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

    if (parsedAmountCP === 0) return;

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
      setContacts(getValues(contactsKey as Path<T>));
    }
  }, [contactsKey, getValues, setContacts]);

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
          <div className="text-center font-semibold uppercase">
            Форма добавления проекта
          </div>
          <div className="grid gap-2 px-2">
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <DatePickerFormField<UseFormReturn<T>>
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
                  placeholder="Название..."
                  required
                />

                <InputTextForm
                  name={"nameObject" as Path<T>}
                  label="Название объекта/Город"
                  control={form.control}
                  errorMessage={getError("nameObject")}
                  placeholder="Название..."
                  required
                />

                <SelectFormField<UseFormReturn<T>>
                  name={"direction" as Path<T>}
                  label="Направление"
                  control={form.control}
                  errorMessage={getError("direction")}
                  options={directionOptions}
                  placeholder="Выберите направление"
                  required
                />

                <SelectFormField<UseFormReturn<T>>
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
                  placeholder="Имя контакта"
                  required
                />

                <InputPhoneForm
                  name="phone"
                  label="Телефон"
                  control={form.control}
                  errorMessage={getError("phone")}
                  placeholder="Введите телефон пользователя"
                />

                <InputTextForm
                  name={"email" as Path<T>}
                  label="Email"
                  control={form.control}
                  errorMessage={getError("email")}
                  className="w-full invalid:[&:not(:placeholder-shown)]:border-red-500"
                  type="email"
                />
              </div>

              <div className="flex flex-col gap-1">
                <InputNumberForm
                  name={"amountCP" as Path<T>}
                  label="Сумма КП"
                  control={form.control}
                  errorMessage={getError("amountCP")}
                  placeholder="Сумма КП"
                />

                <InputNumberForm
                  name={"amountWork" as Path<T>}
                  label="Сумма работ"
                  control={form.control}
                  errorMessage={getError("amountWork")}
                  placeholder="Сумма работ"
                />

                <InputNumberForm
                  name={"amountPurchase" as Path<T>}
                  label="Сумма закупки"
                  control={form.control}
                  errorMessage={getError("amountPurchase")}
                  placeholder="Сумма закупки"
                />

                <InputNumberForm
                  name={"delta" as Path<T>}
                  label="Дельта"
                  control={form.control}
                  errorMessage={getError("delta")}
                  placeholder="Дельта"
                />

                <SelectFormField<UseFormReturn<T>>
                  name={"dealStatus" as Path<T>}
                  label="Статус КП"
                  control={form.control}
                  errorMessage={getError("dealStatus")}
                  options={statusOptions}
                  placeholder="Выберите статус КП"
                />

                <DatePickerFormField<UseFormReturn<T>>
                  name={"plannedDateConnection" as Path<T>}
                  label="Планируемый контакт"
                  control={form.control}
                  errorMessage={getError("plannedDateConnection")}
                  required
                />

                <InputTextForm
                  name={"resource" as Path<T>}
                  label="Источник"
                  control={form.control}
                  errorMessage={getError("resource")}
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
    </MotionDivY>
  );
};

export default ProjectFormBody;
