import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TOAST } from "@/entities/user/ui/Toast";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import { useGetProjectById } from "../../hooks/query";
import { formatterCurrency } from "@/shared/lib/utils";
import {
  DeliveryProject,
  DirectionProject,
  StatusProject,
} from "@prisma/client";
import ProjectFormBody from "./ProjectFormBody";
import FormEditSkeleton from "../Skeletons/FormEditSkeleton";
import { useMutationUpdateProject } from "../../hooks/mutate";


const formatCurrency = (value: string | null | undefined): string => {
  return formatterCurrency.format(parseFloat(value || "0"));
};

const EditProjectForm = ({
  close,
  dealId,
}: {
  close: Dispatch<SetStateAction<void>>;
  dealId: string;
}) => {
  const { data, isPending: isLoading } = useGetProjectById(dealId);

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      dateRequest: undefined,
      nameDeal: data?.nameDeal ?? "",
      nameObject: data?.nameObject ?? "",
      direction: data?.direction ?? "",
      deliveryType: data?.deliveryType ?? undefined,
      dealStatus: data?.dealStatus ?? "",
      contact: data?.contact ?? "",
      phone: data?.phone ?? "",
      email: data?.email ?? "",
      additionalContact: data?.additionalContact ?? "",
      amountCP: data?.amountCP ?? "0",
      delta: data?.delta ?? "0",
      comments: data?.comments ?? "",
      plannedDateConnection: undefined,
      resource: data?.resource ?? "",
    },
  });

  const { mutate, isPending } = useMutationUpdateProject(dealId, close);

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
        phone: data.phone ?? undefined, 
        email: data.email ?? undefined,
        additionalContact: data.additionalContact ?? undefined, 
        dateRequest: data.dateRequest?.toISOString(), 
        deliveryType: (data.deliveryType as DeliveryProject) || undefined,
        dealStatus: data.dealStatus as StatusProject,
        direction: data.direction as DirectionProject,
        plannedDateConnection: data.plannedDateConnection?.toISOString(),
        amountCP: formatCurrency(data.amountCP),
        amountPurchase: formatCurrency(data.amountPurchase),
        amountWork: formatCurrency(data.amountWork),
        delta: formatCurrency(data.delta),
        resource: data.resource ?? "", // Преобразуем null в undefined
      });
    }
  }, [form, data]);

  if (isLoading) return <FormEditSkeleton />;

  return (
    <ProjectFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default EditProjectForm;
