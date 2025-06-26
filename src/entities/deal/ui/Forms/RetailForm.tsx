"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { useParams } from "next/navigation";

import { TOAST } from "@/shared/ui/Toast";

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
    resolver: zodResolver(RetailFormSchema),
    defaultValues: {
      ...defaultRetailValues,
      managersIds: [{ userId: managerId ?? (userId as string) }],
    },
  });

  const { mutateAsync, isPending } = useCreateRetail(form);

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
    />
  );
};

export default RetailForm;
