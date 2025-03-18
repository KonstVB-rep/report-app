import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TOAST } from "@/entities/user/ui/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import { useGetProjectById } from "../../hooks";
import { formatterCurrency } from "@/shared/lib/utils";
import { updateProject } from "../../api";
import {
  DeliveryProject,
  DirectionProject,
  StatusProject,
} from "@prisma/client";
import ProjectFormBody from "./ProjectFormBody";

const EditProjectForm = ({
  close,
  dealId,
  type
}: {
  close: Dispatch<SetStateAction<"add_project" | "edit_project" | null>>;
  dealId: string;
  type: string;
}) => {
  const { authUser } = useStoreUser();
  const { data } = useGetProjectById(dealId, type);

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
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
      amountPurchase: data?.amountPurchase || "0",
      amountWork: data?.amountWork || "0",
      delta: data?.delta || "0",
      comments: data?.comments || "",
      plannedDateConnection: undefined,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProjectSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return updateProject({
        ...data,
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
        amountPurchase: data.amountPurchase
          ? parseFloat(
              data.amountPurchase.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        amountWork: data.amountWork
          ? parseFloat(
              data.amountWork.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
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

  const onSubmit = (data: ProjectSchema) => {
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
        deliveryType: data.deliveryType as DeliveryProject,
        projectStatus: data.projectStatus as StatusProject,
        direction: data.direction as DirectionProject,
        plannedDateConnection: data.plannedDateConnection?.toISOString(), // Преобразуем Date в строку
        email: data.email ?? undefined, // Преобразуем null в undefined
        amountCP: formatterCurrency.format(parseFloat(data.amountCP)),
        amountPurchase: formatterCurrency.format(
          parseFloat(data.amountPurchase)
        ),
        amountWork: formatterCurrency.format(parseFloat(data.amountWork)),
        delta: formatterCurrency.format(parseFloat(data.delta)),
      });
    }
  }, [form, data]);

  return (
    <ProjectFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default EditProjectForm;
