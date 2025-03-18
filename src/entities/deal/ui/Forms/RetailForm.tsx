"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TOAST } from "@/entities/user/ui/Toast";
// import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import { RetailFormSchema, RetailSchema } from "../../model/schema";
import { createRetail } from "../../api";
import useStoreUser from "@/entities/user/store/useStoreUser";
import {
  DeliveryProject,
  DirectionProject,
  StatusProject,
} from "@prisma/client";
import {
  DeliveryRetailLabels,
  DirectionRetailLabels,
  StatusRetailLabels,
} from "../../lib/constants";
import PhoneInput from "@/shared/ui/PhoneInput";
import InputNumber from "@/shared/ui/Inputs/InputNumber";
import InputEmail from "@/shared/ui/Inputs/InputEmail";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";

type RetailFormProps = {
  setOpen: (value: boolean) => void;
};

const RetailForm = ({ setOpen }: RetailFormProps) => {
  const queryClient = useQueryClient();

  const { authUser } = useStoreUser();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RetailSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return createRetail({
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType: data.deliveryType as DeliveryProject,
        dateRequest: new Date(),
        projectStatus: data.projectStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
      });
    },
    onError: (error) => {
      // Обработка ошибок
      console.error("Ошибка при создании проекта:", error);
      TOAST.ERROR("Ошибка при создании проекта");
    },
    onSuccess: (data) => {
      if (data) {
        setOpen(false);

        queryClient.invalidateQueries({
          queryKey: ["retails", authUser?.id],
          exact: true,
        });

        queryClient.invalidateQueries({
          queryKey: ["all-retails", authUser?.departmentId],
        });
      }
    },
  });

  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema),
    defaultValues: {
      nameDeal: "",
      nameObject: "",
      direction: "",
      deliveryType: "",
      contact: "",
      phone: "",
      email: "",
      additionalContact: "",
      amountCP: "",
      delta: "",
      projectStatus: "",
      comments: "",
      plannedDateConnection: undefined,
    },
  });

  const onSubmit = (data: RetailSchema) => {
    TOAST.PROMISE(
      new Promise((resolve, reject) => {
        mutate(data, {
          onSuccess: (data) => {
            resolve(data);
          },
          onError: (error) => {
            reject(error);
          },
        });
      }),
      "Сделка по рознице добавлена"
    );
  };

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
              name="nameObject"
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
                      {form.formState.errors.nameObject?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Направление</FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Выберите направление"
                      options={transformObjValueToArr(DirectionRetailLabels)}
                      onValueChange={(selected) =>
                        form.setValue("direction", selected)
                      }
                      required
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.direction?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.direction?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип поставки</FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Выберите тип поставки"
                      options={transformObjValueToArr(DeliveryRetailLabels)}
                      onValueChange={(selected) =>
                        form.setValue("deliveryType", selected)
                      }
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.deliveryType?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.deliveryType?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Контакты</FormLabel>
                  <FormControl>
                    <Input placeholder="Имя контакта" required {...field} />
                  </FormControl>
                  {form.formState.errors.contact?.message && (
                    <FormMessage className="text-red-500">
                      form.formState.errors.contact?.message
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
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
                      {form.formState.errors.phone?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputEmail {...field} />
                  </FormControl>
                  {form.formState.errors.email?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
          <FormField
              control={form.control}
              name="additionalContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дополнительный контакт</FormLabel>
                  <FormControl>
                    <Input placeholder="Данные контактного лица" {...field} />
                  </FormControl>
                  {form.formState.errors.contact?.message && (
                    <FormMessage className="text-red-500">
                      form.formState.errors.contact?.message
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amountCP"
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
                      {form.formState.errors.amountCP?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="delta"
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
                      {form.formState.errors.delta?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус КП</FormLabel>
                  <FormControl>
                    <SelectComponent
                      placeholder="Выберите статус КП"
                      options={transformObjValueToArr(StatusRetailLabels)}
                      onValueChange={(selected) =>
                        form.setValue("projectStatus", selected)
                      }
                      required
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.projectStatus?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.projectStatus?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plannedDateConnection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h-[19px]">
                    Планируемый контакт
                  </FormLabel>
                  <CalendarComponent field={field} />
                  {form.formState.errors.plannedDateConnection?.message && (
                    <FormMessage className="text-red-500">
                      {form.formState.errors.plannedDateConnection?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comments"
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
                      {form.formState.errors.comments?.message}
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

export default RetailForm;
