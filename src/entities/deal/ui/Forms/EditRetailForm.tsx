import { zodResolver } from "@hookform/resolvers/zod";
import { DeliveryRetail, DirectionRetail, StatusRetail } from "@prisma/client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { formatterCurrency } from "@/shared/lib/utils";
import { TOAST } from "@/shared/ui/Toast";

import { useMutationUpdateRetail } from "../../hooks/mutate";
import { useGetRetailById } from "../../hooks/query";
import { defaultRetailValues } from "../../model/defaultvaluesForm";
import { RetailFormSchema, RetailSchema } from "../../model/schema";
import FormDealSkeleton from "../Skeletons/FormDealSkeleton";
import RetailFormBody from "./RetailFormBody";

const formatCurrency = (value: string | null | undefined): string => {
  return formatterCurrency.format(parseFloat(value || "0"));
};

const EditRetailForm = ({
  close,
  dealId,
}: {
  close: Dispatch<SetStateAction<void>>;
  dealId: string;
}) => {
  const { data, isPending: isLoading } = useGetRetailById(dealId, false);

  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema),
    defaultValues: defaultRetailValues,
  });

  const { mutateAsync, isPending } = useMutationUpdateRetail(
    dealId,
    data?.userId ?? "",
    close
  );

  const onSubmit = (data: RetailSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Данные обновлены");
  };

  useEffect(() => {
    if (data && !isLoading) {
      form.reset({
        ...data,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        dateRequest: data.dateRequest?.toISOString(),
        deliveryType: data.deliveryType as DeliveryRetail,
        dealStatus: data.dealStatus as StatusRetail,
        direction: data.direction as DirectionRetail,
        plannedDateConnection: data.plannedDateConnection?.toISOString(),
        amountCP: formatCurrency(data.amountCP),
        delta: formatCurrency(data.delta),
        resource: data.resource ?? "",
        contacts: data?.additionalContacts ?? [],
      });
    }
  }, [form, data, isLoading]);

  if (isLoading) <FormDealSkeleton />;

  return (
    <RetailFormBody
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      contactsKey="contacts"
    />
  );
};

export default EditRetailForm;
