import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TOAST } from "@/entities/user/ui/Toast";
import { RetailFormSchema, RetailSchema } from "../../model/schema";
import { useGetRetailById } from "../../hooks/query";
import { formatterCurrency } from "@/shared/lib/utils";
import { DeliveryRetail, DirectionRetail, StatusRetail } from "@prisma/client";
import RetailFormBody from "./RetailFormBody";
import FormEditSkeleton from "../Skeletons/FormEditSkeleton";
import { useMutationUpdateRetail } from "../../hooks/mutate";

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
  const { data, isPending: isLoading } = useGetRetailById(dealId);

  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema),
    defaultValues: {
      dateRequest: undefined,
      nameDeal: data?.nameDeal || "",
      nameObject: data?.nameObject || "",
      direction: data?.direction ? String(data.direction) : "",
      deliveryType: data?.deliveryType ? String(data.deliveryType) : "",
      dealStatus: data?.dealStatus ? String(data.dealStatus) : "",
      contact: data?.contact || "",
      phone: data?.phone || "",
      email: data?.email || "",
      additionalContact: data?.additionalContact || "",
      amountCP: data?.amountCP || "0",
      delta: data?.delta || "0",
      comments: data?.comments || "",
      plannedDateConnection: undefined,
      resource: data?.resource || "",
    },
  });

  const { mutateAsync, isPending } = useMutationUpdateRetail(dealId,data!.userId, close);

  const onSubmit = (data: RetailSchema) => {
    TOAST.PROMISE(
         mutateAsync(data),
         "Данные обновлены"
       );
  };

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        phone: data.phone ?? undefined, 
        email: data.email ?? undefined, 
        additionalContact: data.additionalContact ?? undefined, 
        dateRequest: data.dateRequest?.toISOString(), // Преобразуем Date в строку
        deliveryType: data.deliveryType as DeliveryRetail,
        dealStatus: data.dealStatus as StatusRetail,
        direction: data.direction as DirectionRetail,
        plannedDateConnection: data.plannedDateConnection?.toISOString(),
        amountCP: formatCurrency(data.amountCP),
        delta: formatCurrency(data.delta),
        resource: data.resource ?? "",
      });
    }
  }, [form, data]);

  if (isLoading) <FormEditSkeleton />;

  return (
    <RetailFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default EditRetailForm;
