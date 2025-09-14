"use client";

import React, { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

import FormDealSkeleton from "@/entities/deal/ui/Skeletons/FormDealSkeleton";
import ModalContent from "@/shared/custom-components/ui/ModalContent";

const EditProjectForm = dynamic(() => import("../Forms/EditProjectForm"), {
  ssr: false,
  loading: () => <FormDealSkeleton />,
});

const EditProject = ({
  close,
  id,
  isInvalidate = false,
  titleForm = "Создать проект",
}: {
  close: Dispatch<SetStateAction<void>>;
  id: string;
  isInvalidate?: boolean;
  titleForm: string;
}) => {
  return (
    <ModalContent
      title="Редактировать проект"
      className="max-h-[94vh] overflow-y-auto sm:max-w-[825px]"
    >
      <EditProjectForm
        close={close}
        dealId={id}
        isInvalidate={isInvalidate}
        titleForm={titleForm}
      />
    </ModalContent>
  );
};

export default EditProject;
