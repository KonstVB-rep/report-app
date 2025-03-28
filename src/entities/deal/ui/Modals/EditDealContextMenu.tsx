import { DealType } from "@prisma/client";
import React, { Dispatch, SetStateAction } from "react";
import EditRetail from "./EditRetail";
import EditProject from "./EditProject";

const EditDealContextMenu = ({
  close,
  id,
  type,
}: {
  close: Dispatch<SetStateAction<void>>;
  id: string;
  type: DealType;
}) => {
  switch (type) {
    case DealType.PROJECT:
      return <EditProject close={close} id={id} />;
    case DealType.RETAIL:
      return <EditRetail close={close} id={id} />;
    default:
      return null;
  }
};

export default EditDealContextMenu;
