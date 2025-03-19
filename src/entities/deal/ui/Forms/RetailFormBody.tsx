"use client";
import React from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { transformObjValueToArr } from "@/shared/lib/helpers/transformObjValueToArr";
import SelectComponent from "@/shared/ui/SelectComponent";
import CalendarComponent from "@/shared/ui/Calendar";
import {
  DeliveryRetailLabels,
  DirectionRetailLabels,
  StatusRetailLabels,
} from "../../lib/constants";
import PhoneInput from "@/shared/ui/PhoneInput";
import InputNumber from "@/shared/ui/Inputs/InputNumber";
import InputEmail from "@/shared/ui/Inputs/InputEmail";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";

type RetailFormBodyProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
};

const RetailFormBody = <T extends FieldValues>({
  form,
  onSubmit,
  isPending,
}: RetailFormBodyProps<T>) => {

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-10 max-h-[85vh] overflow-y-auto"
      >
        <div className="uppercase font-semibold text-center">
          Форма добавления розничной сделки
        </div>
        <div className="grid sm:grid-cols-2 gap-2 p-1">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name={"nameObject" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название объекта</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Название объекта/Контрагент"
                      required
                      {...field}
                    />
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
                      options={transformObjValueToArr(DirectionRetailLabels)}
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
                      options={transformObjValueToArr(DeliveryRetailLabels)}
                      onValueChange={(selected) =>
                        form.setValue(
                          "deliveryType" as Path<T>,
                          selected as PathValue<T, Path<T>>
                        )
                      }
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
          </div>
          <div className="flex flex-col gap-2">
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
              name={"projectStatus" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус КП</FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Выберите статус КП"
                      options={transformObjValueToArr(StatusRetailLabels)}
                      onValueChange={(selected) =>
                        form.setValue(
                          "projectStatus" as Path<T>,
                          selected as PathValue<T, Path<T>>
                        )
                      }
                      required
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.projectStatus?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.projectStatus?.message as string}
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
          </div>
        </div>
        <SubmitFormButton
          title="Сохранить"
          isPending={isPending}
          className="w-max ml-auto"
        />
      </form>
    </Form>
  );
};

export default RetailFormBody;
