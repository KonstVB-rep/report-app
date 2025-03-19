"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TOAST } from "@/entities/user/ui/Toast";
import { RetailFormSchema, RetailSchema } from "../../model/schema";
import { createRetail } from "../../api";
import useStoreUser from "@/entities/user/store/useStoreUser";
import {
  DeliveryProject,
  DirectionProject,
  StatusProject,
} from "@prisma/client";

import RetailFormBody from "./RetailFormBody";

type RetailFormProps = {
  setOpen: (value: boolean) => void;
};

const RetailForm = ({ setOpen }: RetailFormProps) => {
  const queryClient = useQueryClient();

  const { authUser } = useStoreUser();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RetailSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return createRetail({
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
    onError: (error) => {
      // Обработка ошибок
      console.error("Ошибка при создании проекта:", error);
      TOAST.ERROR("Ошибка при создании проекта");
    },
    onSuccess: (data) => {
      if (data) {
        setOpen(false);

        queryClient.invalidateQueries({
          queryKey: ["retails", authUser?.id],
          exact: true,
        });

        queryClient.invalidateQueries({
          queryKey: ["all-retails", authUser?.departmentId],
        });
      }
    },
  });

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

  return <RetailFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  
};

export default RetailForm;
