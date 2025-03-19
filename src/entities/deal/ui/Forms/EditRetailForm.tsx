import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TOAST } from "@/entities/user/ui/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { RetailFormSchema, RetailSchema } from "../../model/schema";
import { useGetRetailById } from "../../hooks";
import { formatterCurrency } from "@/shared/lib/utils";
import { updateRetail } from "../../api";
import {

  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client";
import RetailFormBody from "./RetailFormBody";

const EditRetailForm = ({
  close,
  dealId,
}: {
  close: Dispatch<SetStateAction<"add_deal" | "edit_deal" | null>>;
  dealId: string;
}) => {
  const { authUser } = useStoreUser();

  const { data } = useGetRetailById(dealId);

  const form = useForm<RetailSchema>({
    resolver: zodResolver(RetailFormSchema),
    defaultValues: {
      nameDeal: data?.nameDeal || "",
      nameObject: data?.nameObject || "",
      direction: data?.direction ? String(data.direction) : "",
      deliveryType: data?.deliveryType ? String(data.deliveryType) : "",
      projectStatus: data?.projectStatus ? String(data.projectStatus) : "",
      contact: data?.contact || "",
      phone: data?.phone || "",
      email: data?.email || "",
      additionalContact: data?.additionalContact || "",
      amountCP: data?.amountCP || "0",
      delta: data?.delta || "0",
      comments: data?.comments || "",
      plannedDateConnection: undefined,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RetailSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return updateRetail({
        id: dealId,
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType: data.deliveryType as DeliveryProject,
        dateRequest: new Date(),
        projectStatus: data.projectStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
      });
    },
    onSuccess: () => {
      close(null);
      queryClient.invalidateQueries({
        queryKey: ["projects", authUser?.id],
        exact: true,
      });
    },
  });

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
      "Проект обновлен"
    );
  };

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        deliveryType: data.deliveryType as DeliveryRetail,
        projectStatus: data.projectStatus as StatusRetail,
        direction: data.direction as DirectionRetail,
        plannedDateConnection: data.plannedDateConnection?.toISOString(), // Преобразуем Date в строку
        email: data.email ?? undefined, // Преобразуем null в undefined
        amountCP: formatterCurrency.format(parseFloat(data.amountCP)),
        delta: formatterCurrency.format(parseFloat(data.delta)),
      });
    }
  }, [form, data]);

  return (
    <RetailFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default EditRetailForm;
