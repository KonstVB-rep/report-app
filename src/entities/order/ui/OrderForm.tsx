"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { TOAST } from "@/shared/ui/Toast";
import { OrderFormSchema, OrderSchema } from "../model/shema";
import { useCreateOrder } from "../hooks/mutate";
import { defaultOrderValues } from "../lib/constants";
import OrderFormBody from "./OrderFormBody";


const OrderForm = () => {
  const form = useForm<OrderSchema>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: defaultOrderValues,
  });

  const { mutateAsync, isPending } = useCreateOrder(form);

  const onSubmit = (data: OrderSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Заявка добавлена");
  };

  return (
    <OrderFormBody
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      // contactsKey="contacts"
    />
  );
};

export default OrderForm;
