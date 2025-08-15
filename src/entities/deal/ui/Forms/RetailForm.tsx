"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { Resolver, useForm } from "react-hook-form";

import { useParams } from "next/navigation";

import { TOAST } from "@/shared/custom-components/ui/Toast";

import { useCreateRetail } from "../../hooks/mutate";
import { defaultRetailValues } from "../../model/defaultvaluesForm";
import { RetailFormSchema, RetailSchema } from "../../model/schema";
import RetailFormBody from "./RetailFormBody";

const RetailForm = ({
  orderId,
  managerId,
}: {
  orderId?: string;
  managerId?: string;
}) => {
  const { userId } = useParams();

  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema) as Resolver<RetailSchema>,
    defaultValues: {
      ...defaultRetailValues,
      managersIds: [{ userId: managerId ?? (userId as string) }],
    },
  });

  const { mutateAsync, isPending } = useCreateRetail(form.reset);

  const onSubmit = (data: RetailSchema) => {
    const dataForm = orderId ? { ...data, orderId: orderId } : data;
    TOAST.PROMISE(mutateAsync(dataForm), "Сделка по рознице добавлена");
  };

  return (
    <RetailFormBody
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      contactsKey="contacts"
      managerId={managerId}
      titleForm={"Создать сделку"}
    />
  );
};

export default RetailForm;
