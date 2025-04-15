import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeliveryProject,
  DirectionProject,
  StatusProject,
} from "@prisma/client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { TOAST } from "@/shared/ui/Toast";

import { useMutationUpdateProject } from "../../hooks/mutate";
import { useGetProjectById } from "../../hooks/query";
import { defaultProjectValues } from "../../model/defaultvaluesForm";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import FormEditSkeleton from "../Skeletons/FormEditSkeleton";
import ProjectFormBody from "./ProjectFormBody";

const EditProjectForm = ({
  close,
  dealId,
}: {
  close: Dispatch<SetStateAction<void>>;
  dealId: string;
}) => {
  const { data, isPending: isLoading } = useGetProjectById(dealId, false);

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: defaultProjectValues,
  });

  const { mutateAsync, isPending } = useMutationUpdateProject(
    dealId,
    data?.userId ?? "",
    close
  );

  const onSubmit = (data: ProjectSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Данные обновлены");
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
        contacts: data.additionalContacts ?? [],
      });
    }
  }, [data, form, isLoading]);

  if (isLoading) return <FormEditSkeleton />;

  return (
    <ProjectFormBody
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      contactsKey="contacts"
    />
  );
};

export default EditProjectForm;
