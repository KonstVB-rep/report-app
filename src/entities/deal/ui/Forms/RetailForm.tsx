"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TOAST } from "@/entities/user/ui/Toast";
import { RetailFormSchema, RetailSchema } from "../../model/schema";

import RetailFormBody from "./RetailFormBody";
import { useCreateRetail } from "../../hooks/mutate";

const RetailForm = () => {
  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema),
    defaultValues: {
      dateRequest: undefined,
      nameDeal: "",
      nameObject: "",
      direction: "",
      deliveryType: undefined,
      contact: "",
      phone: "",
      email: "",
      // additionalContact: "",
      amountCP: "0",
      delta: "0",
      dealStatus: "",
      comments: "",
      plannedDateConnection: undefined,
      resource: "",
    },
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
