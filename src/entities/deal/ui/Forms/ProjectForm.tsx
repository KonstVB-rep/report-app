"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TOAST } from "@/entities/user/ui/Toast";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import ProjectFormBody from "./ProjectFormBody";
import { useCreateProject } from "../../hooks/mutate";

const ProjectForm = () => {
  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      nameObject: "",
      nameDeal: "",
      direction: "",
      deliveryType: undefined,
      contact: "",
      phone: "",
      email: "",
      additionalContact: "",
      amountCP: "",
      amountWork: "",
      amountPurchase: "",
      delta: "",
      dealStatus: "",
      comments: "",
      plannedDateConnection: undefined,
    },
  });

  const { mutate, isPending } = useCreateProject(form);

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
      "Проект создан"
    );
  };

  return (
    <ProjectFormBody form={form} onSubmit={onSubmit} isPending={isPending} />
  );
};

export default ProjectForm;
