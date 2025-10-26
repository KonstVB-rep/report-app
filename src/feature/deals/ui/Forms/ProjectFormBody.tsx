"use client"

import { useEffect } from "react"
import { StatusProject } from "@prisma/client"
import { ArrowLeft } from "lucide-react"
import {
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormReturn,
  useWatch,
} from "react-hook-form"
import z from "zod"
import { UnionParams } from "@/entities/deal/lib/constants"
import { formatNumber, parseFormattedNumber } from "@/entities/deal/lib/helpers"
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
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr"
import useSendDealInfo from "../../api/hooks/useSendDealInfo"
import {
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusContractLabels,
  StatusProjectLabels,
} from "../../lib/constants"
import AddManagerToDeal from "../Modals/AddManagerToDeal"

type ProjectFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  isPending: boolean
  contactsKey?: keyof T
  managerId: string | undefined
  titleForm: string
}

const directionOptions = transformObjValueToArr(DirectionProjectLabels)
const deliveryOptions = transformObjValueToArr(DeliveryProjectLabels)
const statusOptionsProject = transformObjValueToArr(StatusProjectLabels)
const statusOptionsContracts = transformObjValueToArr(StatusContractLabels)

const statusOptions = {
  projects: statusOptionsProject,
  project: statusOptionsProject,
  contracts: statusOptionsContracts,
  contract: statusOptionsContracts,
}

const pageParamsSchema = z.object({
  dealType: z.enum(UnionParams),
})

const ProjectFormBody = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
  contactsKey,
  managerId = "",
  titleForm,
}: ProjectFormBodyProps<T>) => {
  const { dealType } = useTypedParams(pageParamsSchema)

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
  } = useSendDealInfo<T>(onSubmit, managerId, form.getValues("contacts" as Path<T>))

  const watchedValues = useWatch({
    control: form.control,
    name: ["amountCP", "amountWork", "amountPurchase"] as Path<T>[],
  })

  const { getValues } = form

  useEffect(() => {
    const ids = getValues("managersIds" as Path<T>)
    if (ids?.length > 0) setManagers(ids)
  }, [getValues, setManagers])

  useEffect(() => {
    if (!watchedValues) return

    const [amountCP = "0", amountWork = "0", amountPurchase = "0"] = watchedValues || []
    const parsedAmountCP = parseFormattedNumber(amountCP)
    const parsedAmountWork = parseFormattedNumber(amountWork)
    const parsedAmountPurchase = parseFormattedNumber(amountPurchase)

    if (
      Number.isNaN(parsedAmountCP) ||
      Number.isNaN(parsedAmountWork) ||
      Number.isNaN(parsedAmountPurchase)
    )
      return

    if (parsedAmountCP === 0) return

    const calculatedDelta = parsedAmountCP - parsedAmountWork - parsedAmountPurchase

    const calculateDeltaFixed = Number(calculatedDelta.toFixed(2))

    form.setValue("delta" as Path<T>, formatNumber(calculateDeltaFixed) as PathValue<T, Path<T>>, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [form, watchedValues])

  const getError = (name: keyof T) => form.formState.errors[name]?.message as string

  return (
    <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
      <Overlay isPending={isPending} />
      <Form {...form}>
        <form
          className={`grid max-h-[82vh] min-w-full gap-5 overflow-y-auto transform duration-150 ${isAddContact ? "-translate-x-full" : "translate-x-0"}`}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="text-center font-semibold uppercase">{titleForm}</div>
          <div className="grid gap-2 px-2">
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <DatePickerFormField
                  control={form.control}
                  disabled={isPending}
                  errorMessage={getError("dateRequest")}
                  label="Дата запроса"
                  name={"dateRequest" as Path<T>}
                />

                <InputTextForm
                  control={form.control}
                  disabled={isPending}
                  errorMessage={getError("nameDeal")}
                  label="Название сделки"
                  name={"nameDeal" as Path<T>}
                  placeholder="Название..."
                  required
                />

                <InputTextForm
                  control={form.control}
                  disabled={isPending}
                  errorMessage={getError("nameObject")}
                  label="Название объекта/Город"
                  name={"nameObject" as Path<T>}
                  placeholder="Название..."
                  required
                />

                <SelectFormField
                  control={form.control}
                  disabled={isPending}
                  errorMessage={getError("direction")}
                  label="Направление"
                  name={"direction" as Path<T>}
                  options={directionOptions}
                  placeholder="Выберите направление"
                  required
                />

                <SelectFormField
                  control={form.control}
                  disabled={isPending}
                  errorMessage={getError("deliveryType")}
                  label="Тип поставки"
                  name={"deliveryType" as Path<T>}
                  options={deliveryOptions}
                  placeholder="Выберите тип поставки"
                />

                <InputTextForm
                  control={form.control}
                  disabled={isPending}
                  errorMessage={getError("contact")}
                  label="Контакты"
                  name={"contact" as Path<T>}
                  placeholder="Имя контакта"
                  required
                />

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
              </div>

              <div className="flex flex-col gap-1">
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
                  errorMessage={getError("amountWork")}
                  label="Сумма работ"
                  name={"amountWork" as Path<T>}
                  placeholder="Сумма работ"
                />

                <InputNumberForm
                  control={form.control}
                  disabled={isPending}
                  errorMessage={getError("amountPurchase")}
                  label="Сумма закупки"
                  name={"amountPurchase" as Path<T>}
                  placeholder="Сумма закупки"
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
                  options={statusOptions[dealType as keyof typeof statusOptions]}
                  placeholder="Выберите статус КП"
                />

                {form.formState.defaultValues?.dealStatus !== StatusProject.REJECT && (
                  <DatePickerFormField
                    className="mb-2"
                    control={form.control}
                    disabled={isPending}
                    errorMessage={getError("plannedDateConnection")}
                    label="Планируемый контакт"
                    name={"plannedDateConnection" as Path<T>}
                  />
                )}

                <InputTextForm
                  className="mb-2"
                  control={form.control}
                  disabled={isPending}
                  errorMessage={getError("resource")}
                  label="Источник"
                  name={"resource" as Path<T>}
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
                          disabled={isPending}
                          placeholder="Введите комментарии"
                          required
                          {...field}
                        />
                      </FormControl>

                      {getError("comments") && (
                        <FormMessage className="text-red-500">{getError("comments")}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2">
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
          </div>
        </form>
        <div
          className={`min-w-full flex flex-col gap-2 trаnsform ${isAddContact ? "-translate-x-full" : "translate-x-0"} duration-150`}
        >
          <Button onClick={toggleAddContact} size="icon" type="button" variant="outline">
            <ArrowLeft />
          </Button>

          <ContactDeal
            contacts={contacts as Contact[]}
            contactsKey={contactsKey as string | null}
            handleDeleteContact={handleDeleteContact}
            onContactsChange={setContacts}
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
          />
        </div>
      </Form>
    </MotionDivY>
  )
}

export default ProjectFormBody
