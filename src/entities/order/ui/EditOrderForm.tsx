import { zodResolver } from "@hookform/resolvers/zod";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { TOAST } from "@/shared/ui/Toast";

import OrderFormBody from "./OrderFormBody";
import FormDealSkeleton from "@/entities/deal/ui/Skeletons/FormDealSkeleton";
import { defaultOrderValues } from "../lib/constants";
import { OrderSchema, OrderFormSchema } from "../model/shema";
import { useGetOrderById } from "../hooks/query";
import { useUpdateOrder } from "../hooks/mutate";

const EditOrderForm = ({
  close,
  dealId,
}: {
  close: Dispatch<SetStateAction<void>>;
  dealId: string;
}) => {
  const { data, isPending: isLoading } = useGetOrderById(dealId, true);

  const form = useForm<OrderSchema>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: defaultOrderValues,
  });

  const { mutateAsync, isPending } = useUpdateOrder(
    close
  );

const onSubmit = (formData: OrderSchema) => {
  if (!data) return; // На всякий случай

  TOAST.PROMISE(
    mutateAsync({
      orderId: data.id,
      order: {
        ...data,
        ...formData,
        dateRequest: formData.dateRequest ? new Date(formData.dateRequest) : new Date(),
      }
    }),
    "Данные обновлены"
  );
};

  useEffect(() => {
    if (data && !isLoading) {
      form.reset({
        ...data,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        dateRequest: data.dateRequest?.toISOString(),
        resource: data.resource ?? "",
        manager: data.manager 
      });
    }
  }, [form, data, isLoading]);

  if (isLoading) <FormDealSkeleton />;

  return (
    <OrderFormBody
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
    />
  );
};

export default EditOrderForm;
