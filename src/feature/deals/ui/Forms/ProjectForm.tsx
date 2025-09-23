"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { Resolver, useForm } from "react-hook-form";

import z from "zod";

import { ProjectFormSchema, ProjectSchema } from "@/entities/deal/model/schema";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { useTypedParams } from "@/shared/hooks/useTypedParams";

import { useCreateProject } from "../../api/hooks/mutate";
import { defaultProjectValues } from "../../model/defaultvaluesForm";
import ProjectFormBody from "./ProjectFormBody";

const pageParamsSchema = z.object({
  userId: z.string(),
});

const ProjectForm = ({
  orderId,
  managerId,
}: {
  orderId?: string;
  managerId?: string;
}) => {
  const { userId } = useTypedParams(pageParamsSchema);

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema) as Resolver<ProjectSchema>,
    defaultValues: {
      ...defaultProjectValues,
      managersIds: [{ userId: managerId ?? userId }],
    },
  });

  const { mutateAsync, isPending } = useCreateProject(form.reset);

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
      titleForm={"создать проект"}
    />
  );
};

export default ProjectForm;
