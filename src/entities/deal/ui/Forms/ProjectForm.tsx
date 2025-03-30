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
      dateRequest: undefined,
      nameObject: "",
      nameDeal: "",
      direction: "",
      deliveryType: undefined,
      contact: "",
      phone: "",
      email: "",
      additionalContact: "",
      amountCP: "0",
      amountWork: "0",
      amountPurchase: "0",
      delta: "0",
      dealStatus: "",
      comments: "",
      plannedDateConnection: undefined,
      resource: "",
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
