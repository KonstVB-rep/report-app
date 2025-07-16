"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { TOAST } from "@/shared/ui/Toast";

import { useCreateOrder } from "../hooks/mutate";
import { defaultOrderValues } from "../lib/constants";
import { OrderFormSchema, OrderSchema } from "../model/shema";
import OrderFormBody from "./OrderFormBody";

const OrderForm = () => {
  const form = useForm<OrderSchema>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: defaultOrderValues,
  });

  const { mutateAsync, isPending } = useCreateOrder(form.reset);

  const onSubmit = (data: OrderSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Заявка добавлена");
  };

  return (
    <OrderFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default OrderForm;
