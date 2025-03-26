import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import CalendarComponent from "@/shared/ui/Calendar";
import InputEmail from "@/shared/ui/Inputs/InputEmail";
import InputNumber from "@/shared/ui/Inputs/InputNumber";
import PhoneInput from "@/shared/ui/PhoneInput";
import SelectComponent from "@/shared/ui/SelectComponent";
import React from "react";
import {
  DirectionProjectLabels,
  DeliveryProjectLabels,
  StatusProjectLabels,
} from "../../lib/constants";
import { Input } from "@/components/ui/input";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

type ProjectFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
};

const ProjectFormBody = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
}: ProjectFormBodyProps<T>) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid max-h-[85vh] gap-10 overflow-y-auto"
      >
        <div className="text-center font-semibold uppercase">
          Форма добавления проекта
        </div>
        <div className="grid gap-2 p-2 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name={"dateRequest" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата запроса</FormLabel>
                  <CalendarComponent field={field} />
                  {form.formState.errors.dateRequest?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.dateRequest?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"nameDeal" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название сделки</FormLabel>
                  <FormControl>
                    <Input placeholder="Название..." required {...field} />
                  </FormControl>
                  {form.formState.errors.nameDeal?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.nameDeal?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"nameObject" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название объекта/Город</FormLabel>
                  <FormControl>
                    <Input placeholder="Название..." required {...field} />
                  </FormControl>
                  {form.formState.errors.nameObject?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.nameObject?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"direction" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Направление</FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Выберите направление"
                      options={transformObjValueToArr(DirectionProjectLabels)}
                      onValueChange={(selected) =>
                        form.setValue(
                          "direction" as Path<T>,
                          selected as PathValue<T, Path<T>>
                        )
                      }
                      required
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.direction?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.direction?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"deliveryType" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип поставки</FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Выберите тип поставки"
                      options={transformObjValueToArr(DeliveryProjectLabels)}
                      onValueChange={(selected) => {
                        return form.setValue(
                          "deliveryType" as Path<T>,
                          selected as PathValue<T, Path<T>>
                        );
                      }}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.deliveryType?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.deliveryType?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"contact" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Контакты</FormLabel>
                  <FormControl>
                    <Input placeholder="Имя контакта" required {...field} />
                  </FormControl>
                  {form.formState.errors.contact?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.contact?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"phone" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Введите телефон пользователя"
                      onAccept={field.onChange}
                      required={true}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.phone?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.phone?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"email" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputEmail {...field} />
                  </FormControl>
                  {form.formState.errors.email?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.email?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"additionalContact" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дополнительный контакт</FormLabel>
                  <FormControl>
                    <Input placeholder="Данные контактного лица" {...field} />
                  </FormControl>
                  {form.formState.errors.contact?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.contact?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name={"amountCP" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма КП</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Сумма КП"
                      {...field}
                      value={String(field.value || "")}
                    />
                  </FormControl>
                  {form.formState.errors.amountCP?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.amountCP?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"amountWork" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма работ</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Сумма работ"
                      {...field}
                      value={String(field.value || "")}
                    />
                  </FormControl>
                  {form.formState.errors.amountWork?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.amountWork?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"amountPurchase" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма закупки</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Сумма закупки"
                      {...field}
                      value={String(field.value || "")}
                    />
                  </FormControl>
                  {form.formState.errors.amountPurchase?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.amountPurchase?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"delta" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дельта</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Дельта"
                      {...field}
                      value={String(field.value || "")}
                    />
                  </FormControl>
                  {form.formState.errors.delta?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.delta?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"dealStatus" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус КП</FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Выберите статус КП"
                      options={transformObjValueToArr(StatusProjectLabels)}
                      onValueChange={(selected) =>
                        form.setValue(
                          "dealStatus" as Path<T>,
                          selected as PathValue<T, Path<T>>
                        )
                      }
                      required
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.dealStatus?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.dealStatus?.message as string}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"plannedDateConnection" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h-[19px]">
                    Планируемый контакт
                  </FormLabel>
                  <CalendarComponent field={field} />
                  {form.formState.errors.plannedDateConnection?.message && (
                    <FormMessage className="text-red-500">
                      {
                        form.formState.errors.plannedDateConnection
                          ?.message as string
                      }
                    </FormMessage>
                  )}
                </FormItem>
              )}
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
            <FormField
              control={form.control}
              name={"resource" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Источник</FormLabel>
                  <FormControl>
                    <Input placeholder="Сайт откуда пришлол клиент" required {...field} />
                  </FormControl>
                  {form.formState.errors.resource?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.resource?.message as string}
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
      </form>
    </Form>
  );
};

export default ProjectFormBody;
