import { zodResolver } from "@hookform/resolvers/zod";
import { DeliveryRetail, DirectionRetail, StatusRetail } from "@prisma/client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { withAuthCheck } from "@/shared/lib/helpers/withAuthCheck";
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
  const { authUser } = useStoreUser();

  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema),
    defaultValues: defaultRetailValues,
  });

  const { mutateAsync, isPending } = useMutationUpdateRetail(
    dealId,
    data?.userId ?? "",
    close
  );

  const onSubmit = withAuthCheck(async (data: RetailSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Данные обновлены");
  });

  const { reset } = form;

useEffect(() => {
  if (data && !isLoading) {
    const formattedData = {
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
      managersIds: Array.isArray(data.managers)
        ? data.managers.map((manager) => ({ userId: manager.id }))
        : [],
    };
    reset(formattedData);
  }
}, [reset, data, isLoading]);

  if (isLoading) return <FormDealSkeleton />;
  if (!data) return null;  

  return (
    <RetailFormBody
      key={dealId}
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      contactsKey="contacts"
      managerId={data?.userId || authUser?.id}
    />
  );
};

export default EditRetailForm;
