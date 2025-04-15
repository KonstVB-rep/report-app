"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";

import { TOAST } from "@/shared/ui/Toast";

import { useCreateProject } from "../../hooks/mutate";
import { defaultProjectValues } from "../../model/defaultvaluesForm";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import ProjectFormBody from "./ProjectFormBody";

const ProjectForm = () => {
  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: defaultProjectValues,
  });

  const { mutateAsync, isPending } = useCreateProject(form);

  const onSubmit = (data: ProjectSchema) => {
    TOAST.PROMISE(mutateAsync(data), "Проект создан");
  };

  return (
    <ProjectFormBody
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      contactsKey="contacts"
    />
  );
};

export default ProjectForm;
