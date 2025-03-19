"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TOAST } from "@/entities/user/ui/Toast";
// import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import { ProjectFormSchema, ProjectSchema } from "../../model/schema";
import { createProject } from "../../api";
import useStoreUser from "@/entities/user/store/useStoreUser";
import {
  DeliveryProject,
  DirectionProject,
  StatusProject,
} from "@prisma/client";
import ProjectFormBody from "./ProjectFormBody";

// type ProjectFormProps = {
//   // form: UseFormReturn<ProjectSchema>;
//   // onSubmit: (data: ProjectSchema) => void;
//   // isPending: boolean;
//   setOpen?: (value: boolean) => void;
// };

const ProjectForm = () => {
  const queryClient = useQueryClient();

  const { authUser } = useStoreUser();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProjectSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }
      console.log("data", data);
      return createProject({
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType:
          data.deliveryType === "" ? null : data.deliveryType as DeliveryProject,
        dateRequest: new Date(),
        projectStatus: data.projectStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
        amountPurchase: data.amountPurchase
          ? parseFloat(
              data.amountPurchase.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        amountWork: data.amountWork
          ? parseFloat(
              data.amountWork.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
      });
    },
    onSuccess: (data) => {
      if (data) {
        // setOpen(false);
        form.reset();

        queryClient.invalidateQueries({
          queryKey: ["projects", authUser?.id],
          exact: true,
        });

        queryClient.invalidateQueries({
          queryKey: ["all-projects", authUser?.departmentId],
        });
      }
    },
  });

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      nameObject: "ewwew",
      nameDeal: "wewewe",
      direction: "",
      deliveryType: undefined,
      contact: "dasdasd",
      phone: "",
      email: "",
      additionalContact: "",
      amountCP: "",
      amountWork: "",
      amountPurchase: "",
      delta: "",
      projectStatus: "",
      comments: "sdasdasd",
      plannedDateConnection: undefined,
    },
  });

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
