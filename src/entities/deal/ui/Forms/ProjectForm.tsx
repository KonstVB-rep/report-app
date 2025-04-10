"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TOAST } from "@/entities/user/ui/Toast";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import ProjectFormBody from "./ProjectFormBody";
import { useCreateProject } from "../../hooks/mutate";
import { defaultProjectValues } from "../../model/defaultvaluesForm";

const ProjectForm = () => {
  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: defaultProjectValues,
  });

  const { mutateAsync, isPending } = useCreateProject(form);


  const onSubmit = (data: ProjectSchema) => {
    TOAST.PROMISE(
      mutateAsync(data),
      "Проект создан"
    );
  };

  return (
    <ProjectFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default ProjectForm;
