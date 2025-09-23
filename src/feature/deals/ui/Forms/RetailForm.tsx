"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { Resolver, useForm } from "react-hook-form";

import z from "zod";

import { RetailFormSchema, RetailSchema } from "@/entities/deal/model/schema";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { useTypedParams } from "@/shared/hooks/useTypedParams";

import { useCreateRetail } from "../../api/hooks/mutate";
import { defaultRetailValues } from "../../model/defaultvaluesForm";
import RetailFormBody from "./RetailFormBody";

const pageParamsSchema = z.object({
  userId: z.string(),
});

const RetailForm = ({
  orderId,
  managerId,
}: {
  orderId?: string;
  managerId?: string;
}) => {
  const { userId } = useTypedParams(pageParamsSchema);

  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema) as Resolver<RetailSchema>,
    defaultValues: {
      ...defaultRetailValues,
      managersIds: [{ userId: managerId ?? userId }],
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
