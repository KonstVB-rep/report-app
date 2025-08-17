import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";

import FormDealSkeleton from "@/entities/deal/ui/Skeletons/FormDealSkeleton";
import { TOAST } from "@/shared/custom-components/ui/Toast";

import { useUpdateOrder } from "../hooks/mutate";
import { useGetOrderById } from "../hooks/query";
import { defaultOrderValues } from "../lib/constants";
import { OrderFormSchema, OrderSchema } from "../model/shema";
import OrderFormBody from "./OrderFormBody";

const EditOrderForm = ({
  close,
  dealId,
}: {
  close: () => void;
  dealId: string;
}) => {
  const { data, isPending: isLoading } = useGetOrderById(dealId, true);

  const form = useForm<OrderSchema>({
    resolver: zodResolver(OrderFormSchema) as Resolver<OrderSchema>,
    defaultValues: defaultOrderValues,
  });

  const { mutateAsync, isPending } = useUpdateOrder(close);

  const onSubmit = (formData: OrderSchema) => {
    if (!data) return;

    TOAST.PROMISE(
      mutateAsync({
        orderId: data.id,
        order: {
          ...data,
          ...formData,
          dateRequest: formData.dateRequest
            ? new Date(formData.dateRequest)
            : new Date(),
        },
      }),
      "Данные обновлены"
    );
  };

  const { reset } = form;

  useEffect(() => {
    if (data && !isLoading) {
      reset({
        ...data,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        dateRequest: data.dateRequest?.toISOString(),
        resource: data.resource ?? "",
        manager: data.manager,
        comments: data.comments ?? null,
      });
    }
  }, [reset, data, isLoading]);

  if (isLoading) <FormDealSkeleton />;

  return (
    <OrderFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default EditOrderForm;
