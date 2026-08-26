"use client"

import { useMemo } from "react"
import { type DealType, StatusRetail } from "@prisma/client"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { FieldValues, Path, UseFormReturn } from "react-hook-form"
import type { Contact } from "@/entities/deal/types"
import ContactDeal from "@/feature/contact/ui/ContactDeal"
import { Button } from "@/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Textarea } from "@/shared/components/ui/textarea"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import DatePickerFormField from "@/shared/custom-components/ui/Inputs/DatePickerFormField"
import InputNumberForm from "@/shared/custom-components/ui/Inputs/InputNumberForm"
import InputPhoneForm from "@/shared/custom-components/ui/Inputs/InputPhoneForm"
import InputTextForm from "@/shared/custom-components/ui/Inputs/InputTextForm"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import Overlay from "@/shared/custom-components/ui/Overlay"
import SelectFormField from "@/shared/custom-components/ui/SelectForm/SelectFormField"
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr"
import useSendDealInfo from "../../api/hooks/useSendDealInfo"
import {
  DeliveryRetailLabels,
  DirectionRetailLabels,
  StatusRetailLabels,
} from "../../lib/constants"
import Comments from "../Comments"
import AddManagerToDeal from "../Modals/AddManagerToDeal"
import Files from "./Files"

type RetailFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  isPending: boolean
  contactsKey?: keyof T
  managerId: string | undefined
  titleForm: string
}

const directionOptions = transformObjValueToArr(DirectionRetailLabels)
const deliveryOptions = transformObjValueToArr(DeliveryRetailLabels)
const statusOptions = transformObjValueToArr(StatusRetailLabels)

const date = new Date()
date.setUTCHours(6, 0, 0, 0)
const today = date.toISOString()

const RetailFormBody = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
  contactsKey,
  managerId = "",
  titleForm,
}: RetailFormBodyProps<T>) => {
  const initialManagersIds = form.getValues("managersIds" as Path<T>)
  const dataDeal = form.formState.defaultValues
  const initialManagers = useMemo(
    () =>
      initialManagersIds?.length ? initialManagersIds : managerId ? [{ userId: managerId }] : [],
    [initialManagersIds, managerId],
  )

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
    isAddFile,
    setIsAddFile,
  } = useSendDealInfo<T>(
    onSubmit,
    managerId,
    form.getValues("contacts" as Path<T>),
    initialManagers,
  )

  const getError = (name: keyof T) => form.formState.errors[name]?.message as string
  const currentStatus = form.watch("dealStatus" as Path<T>)

  return (
    <MotionDivY className="max-h-[82vh] overflow-y-auto flex justify-center overflow-x-hidden">
      <Overlay isPending={isPending} />
      <div
        className={`min-w-full flex flex-col gap-2 trаnsform ${isAddFile ? "translate-x-full" : "translate-x-0"} duration-150`}
      >
        <Button onClick={() => setIsAddFile(false)} size="icon" type="button" variant="outline">
          <ArrowRight />
        </Button>

        {dataDeal && (
          <Files
            dataDeal={{
              id: dataDeal.id as string,
              type: dataDeal.type as DealType,
              userId: (dataDeal.userId as string) || null,
            }}
          />
        )}
      </div>
      <Form {...form}>
        <form
          className={`grid max-h-[85dvh] min-w-full pb-1 gap-2 overflow-y-auto transform duration-150 ${
            isAddContact ? "-translate-x-full" : isAddFile ? "translate-x-full" : "translate-x-0"
          }`}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="text-center font-semibold uppercase">{titleForm}</div>
          <div className="grid gap-2 p-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <DatePickerFormField
                control={form.control}
                disabled={isPending}
                errorMessage={getError("dateRequest")}
                label="Дата запроса"
                name={"dateRequest" as Path<T>}
                required
              />

              <InputTextForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("nameDeal")}
                label="Название сделки"
                name={"nameDeal" as Path<T>}
                placeholder="Название..."
                required
                showStarRequired
              />

              <InputTextForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("inn")}
                label="ИНН"
                name={"inn" as Path<T>}
                placeholder="Номер..."
              />

              <InputTextForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("nameObject")}
                label="Название объекта/Город"
                name={"nameObject" as Path<T>}
                placeholder="Название..."
              />

              <SelectFormField
                control={form.control}
                disabled={isPending}
                errorMessage={getError("direction")}
                label="Направление"
                name={"direction" as Path<T>}
                options={directionOptions}
                placeholder="Выберите направление"
                required={currentStatus !== StatusRetail.REQUEST}
              />

              <SelectFormField
                control={form.control}
                disabled={isPending}
                errorMessage={getError("deliveryType")}
                label="Тип поставки"
                name={"deliveryType" as Path<T>}
                options={deliveryOptions}
                placeholder="Выберите тип поставки"
                required={currentStatus !== StatusRetail.REQUEST}
              />

              <InputTextForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("contact")}
                label="Контакты"
                name={"contact" as Path<T>}
                placeholder="Имя контакта"
                required={currentStatus !== StatusRetail.REQUEST}
                showStarRequired={currentStatus !== StatusRetail.REQUEST}
              />
            </div>

            <div className="flex flex-col gap-1">
              <InputPhoneForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("phone")}
                label="Телефон"
                name={"phone" as Path<T>}
                placeholder="Введите телефон пользователя"
              />

              <InputTextForm
                className="w-full invalid:not-placeholder-shown:border-red-500"
                control={form.control}
                disabled={isPending}
                errorMessage={getError("email")}
                label="Email"
                name={"email" as Path<T>}
                type="email"
              />

              <InputNumberForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("amountCP")}
                label="Сумма КП"
                name={"amountCP" as Path<T>}
                placeholder="Сумма КП"
              />

              <InputNumberForm
                control={form.control}
                disabled={isPending}
                errorMessage={getError("delta")}
                label="Дельта"
                name={"delta" as Path<T>}
                placeholder="Дельта"
              />

              <SelectFormField
                control={form.control}
                disabled={isPending}
                errorMessage={getError("dealStatus")}
                label="Статус КП"
                name={"dealStatus" as Path<T>}
                options={statusOptions}
                placeholder="Выберите статус КП"
              />

              {currentStatus !== StatusRetail.REJECT && (
                <DatePickerFormField
                  className="mb-2"
                  control={form.control}
                  disabled={isPending}
                  errorMessage={getError("plannedDateConnection")}
                  label="Планируемый контакт"
                  name={"plannedDateConnection" as Path<T>}
                />
              )}

              <DatePickerFormField
                className="mb-2"
                control={form.control}
                defaultValue={today}
                disabled={isPending}
                errorMessage={getError("lastDateConnection")}
                label="Последний контакт"
                name={"lastDateConnection" as Path<T>}
              />

              <InputTextForm
                className="mb-2"
                control={form.control}
                disabled={isPending}
                errorMessage={getError("resource")}
                label="Источник"
                name={"resource" as Path<T>}
                placeholder="Откуда пришёл клиент"
                required={currentStatus !== StatusRetail.REQUEST}
                showStarRequired={currentStatus !== StatusRetail.REQUEST}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name={"commentsLastConnection" as Path<T>}
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>
                  Последний комментарий<span className="text-red-700">*</span>
                </FormLabel>

                <FormControl>
                  <Textarea
                    disabled={isPending}
                    placeholder="Введите комментарии"
                    required
                    {...field}
                  />
                </FormControl>

                {getError("commentsLastConnection") && (
                  <FormMessage className="text-red-500">
                    {getError("commentsLastConnection")}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <Comments form={form} getError={getError} />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAddFile(true)}
                size={isAddFile ? "icon" : undefined}
                type="button"
                variant="outline"
              >
                {isAddFile ? <ArrowRight /> : "Добавить файлы"}
              </Button>

              <Button
                onClick={toggleAddContact}
                size={isAddContact ? "icon" : undefined}
                type="button"
                variant="outline"
              >
                {isAddContact ? <ArrowLeft /> : "Добавить доп.контакт"}
              </Button>

              <AddManagerToDeal
                firstManager={firstManager}
                managers={managers}
                setFirstManager={setFirstManager}
                setManagers={setManagers}
              />
            </div>

            <SubmitFormButton
              className="ml-auto mr-2 w-max"
              isPending={isPending}
              title="Сохранить"
            />
          </div>
        </form>

        <div
          className={`min-w-full flex flex-col gap-2 transform duration-150 ${isAddContact ? "-translate-x-full" : "translate-x-0"}`}
        >
          <Button onClick={toggleAddContact} size="icon" type="button" variant="outline">
            <ArrowLeft />
          </Button>
          <ContactDeal
            contacts={contacts as Contact[]}
            contactsKey={contactsKey as string}
            handleDeleteContact={handleDeleteContact}
            onContactsChange={setContacts}
            selectedContacts={selectedContacts as Contact[]}
            setSelectedContacts={setSelectedContacts}
          />
        </div>
      </Form>
    </MotionDivY>
  )
}

export default RetailFormBody
