"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TOAST } from "@/entities/user/ui/Toast";
import { RetailFormSchema, RetailSchema } from "../../model/schema";

import RetailFormBody from "./RetailFormBody";
import { useCreateRetail } from "../../hooks/mutate";
import { defaultRetailValues } from "../../model/defaultvaluesForm";

const RetailForm = () => {
  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema),
    defaultValues: defaultRetailValues,
  });

  const { mutateAsync, isPending } = useCreateRetail(form);

  const onSubmit = (data: RetailSchema) => {
    TOAST.PROMISE(
      mutateAsync(data),
      "Сделка по рознице добавлена"
    );
  };

  return (
    <RetailFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default RetailForm;
