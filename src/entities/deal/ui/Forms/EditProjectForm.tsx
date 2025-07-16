import { zodResolver } from "@hookform/resolvers/zod";
import {
  DeliveryProject,
  DirectionProject,
  StatusProject,
} from "@prisma/client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { withAuthCheck } from "@/shared/lib/helpers/withAuthCheck";
import { TOAST } from "@/shared/ui/Toast";

import { useMutationUpdateProject } from "../../hooks/mutate";
import { useGetProjectById } from "../../hooks/query";
import { defaultProjectValues } from "../../model/defaultvaluesForm";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import FormDealSkeleton from "../Skeletons/FormDealSkeleton";
import ProjectFormBody from "./ProjectFormBody";

type Props = {
  close: Dispatch<SetStateAction<void>>;
  dealId: string;
};

const EditProjectForm = ({ close, dealId }: Props) => {
  const { data, isPending: isLoading } = useGetProjectById(dealId, false);
  const { authUser } = useStoreUser();

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: defaultProjectValues,
  });

  const { mutateAsync, isPending } = useMutationUpdateProject(
    dealId,
    data?.userId ?? "",
    close
  );

  const onSubmit = withAuthCheck(async (data: ProjectSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Данные обновлены");
  });

  const { reset } = form;

  useEffect(() => {
    if (data && !isLoading) {
      reset({
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
        managersIds: Array.isArray(data.managers)
          ? data.managers.map((manager) => ({ userId: manager.id }))
          : [],
      });
    }
  }, [data, reset, isLoading]);

  if (isLoading) return <FormDealSkeleton />;

  return (
    <ProjectFormBody
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      contactsKey="contacts"
      managerId={data?.userId || authUser?.id}
    />
  );
};

export default EditProjectForm;
