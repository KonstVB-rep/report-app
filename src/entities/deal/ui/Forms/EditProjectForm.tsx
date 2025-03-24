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
      nameDeal: data?.nameDeal || "",
      nameObject: data?.nameObject || "",
      direction: data?.direction ? String(data.direction) : "",
      deliveryType:
        data?.deliveryType === null
          ? undefined
          : (data?.deliveryType as DeliveryProject),
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
        deliveryType: (data.deliveryType as DeliveryProject) || undefined,
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

  if (isLoading) return <FormEditSkeleton />;

  return (
    <ProjectFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default EditProjectForm;
