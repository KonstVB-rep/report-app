"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { useParams } from "next/navigation";

import { TOAST } from "@/shared/ui/Toast";

import { useCreateProject } from "../../hooks/mutate";
import { defaultProjectValues } from "../../model/defaultvaluesForm";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import ProjectFormBody from "./ProjectFormBody";

const ProjectForm = ({
  orderId,
  managerId,
}: {
  orderId?: string;
  managerId?: string;
}) => {
  const { userId } = useParams();

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      ...defaultProjectValues,
      managersIds: [{ userId: managerId ?? (userId as string) }],
    },
  });

  const { mutateAsync, isPending } = useCreateProject(
    form,
    managerId || (userId as string)
  );

  const onSubmit = (data: ProjectSchema) => {
    const dataForm = orderId ? { ...data, orderId: orderId } : data;
    TOAST.PROMISE(mutateAsync(dataForm), "Проект создан");
  };

  return (
    <ProjectFormBody
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      managerId={managerId}
      contactsKey="contacts"
    />
  );
};

export default ProjectForm;
