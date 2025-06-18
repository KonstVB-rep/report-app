import { DealType } from "@prisma/client";

import React, { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

const EditProject = dynamic(() => import("./EditProject"), { ssr: false });
const EditRetail = dynamic(() => import("./EditRetail"), { ssr: false });

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
    case DealType.ORDER:
      return <EditOrder close={close} id={id} />;
    default:
      return null;
  }
};

export default EditDealContextMenu;
