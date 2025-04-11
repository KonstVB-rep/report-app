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
import { defaultProjectValues } from "../../model/defaultvaluesForm";

const EditProjectForm = ({
  close,
  dealId,
}: {
  close: Dispatch<SetStateAction<void>>;
  dealId: string;
}) => {
  const { data, isPending: isLoading } = useGetProjectById(dealId,false);

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: defaultProjectValues,
  });

  const { mutateAsync, isPending } = useMutationUpdateProject(dealId, data?.userId ?? "", close);

  const onSubmit = (data: ProjectSchema) => {
    TOAST.PROMISE(
      mutateAsync(data),
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
        deliveryType: (data.deliveryType as DeliveryProject) || undefined,
        dealStatus: data.dealStatus as StatusProject,
        direction: data.direction as DirectionProject,
        plannedDateConnection: data.plannedDateConnection?.toISOString(),
        amountCP: data.amountCP,
        amountPurchase: data.amountPurchase,
        amountWork: data.amountWork,
        delta: data.delta,
        resource: data.resource ?? "",
        contacts: data.additionalContacts  ?? [],
      });
    }
  }, [data, form, isLoading]);

  if (isLoading) return <FormEditSkeleton />;

  return (
    <ProjectFormBody form={form} onSubmit={onSubmit} isPending={isPending} contactsKey="contacts"/>
  );
};

export default EditProjectForm;
