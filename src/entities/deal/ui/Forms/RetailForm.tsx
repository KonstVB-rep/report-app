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
      nameDeal: "",
      nameObject: "",
      direction: "",
      deliveryType: undefined,
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

  const { mutate, isPending } = useCreateRetail(form);

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
    <RetailFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default RetailForm;
