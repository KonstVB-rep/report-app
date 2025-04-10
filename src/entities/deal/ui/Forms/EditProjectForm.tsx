import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TOAST } from "@/entities/user/ui/Toast";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import { useGetProjectById } from "../../hooks/query";
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
      dateRequest: undefined,
      nameDeal: data?.nameDeal ?? "",
      nameObject: data?.nameObject ?? "",
      direction: data?.direction ?? "",
      deliveryType: data?.deliveryType ?? undefined,
      dealStatus: data?.dealStatus ?? "",
      contact: data?.contact ?? "",
      phone: data?.phone ?? "",
      email: data?.email ?? "",
      // additionalContact: data?.additionalContact ?? "",
      amountCP: data?.amountCP ?? "",
      amountWork: data?.amountWork ?? "",
      amountPurchase: data?.amountPurchase ?? "",
      delta: data?.delta ?? "",
      comments: data?.comments ?? "",
      plannedDateConnection: undefined,
      resource: data?.resource ?? "",
    },
  });

  const { mutateAsync, isPending } = useMutationUpdateProject(dealId, data!.userId, close);

  const onSubmit = (data: ProjectSchema) => {
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
        // additionalContact: data.additionalContact ?? undefined, 
        dateRequest: data.dateRequest?.toISOString(), 
        deliveryType: (data.deliveryType as DeliveryProject) || undefined,
        dealStatus: data.dealStatus as StatusProject,
        direction: data.direction as DirectionProject,
        plannedDateConnection: data.plannedDateConnection?.toISOString(),
        amountCP: data.amountCP ?? "",
        amountPurchase: data.amountPurchase ?? "",
        amountWork: data.amountWork ?? "",
        delta: data.delta ?? "",
        resource: data.resource ?? "",
      });
    }
  }, [form, data]);

  if (isLoading) return <FormEditSkeleton />;

  return (
    <ProjectFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default EditProjectForm;
