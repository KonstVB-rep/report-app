"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { TOAST } from "@/shared/ui/Toast";

import { useCreateRetail } from "../../hooks/mutate";
import { defaultRetailValues } from "../../model/defaultvaluesForm";
import { RetailFormSchema, RetailSchema } from "../../model/schema";
import RetailFormBody from "./RetailFormBody";

const RetailForm = () => {
  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema),
    defaultValues: defaultRetailValues,
  });

  const { mutateAsync, isPending } = useCreateRetail(form);

  const onSubmit = (data: RetailSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Сделка по рознице добавлена");
  };

  return (
    <RetailFormBody
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      contactsKey="contacts"
    />
  );
};

export default RetailForm;
