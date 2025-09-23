import React from "react";

import { BookUser, ContactRound, Mail, PhoneOutgoing } from "lucide-react";

import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent";
import { cn } from "@/shared/lib/utils";

import { CardInfoType } from "../types";

const ICONS = {
  phone: <PhoneOutgoing className="icon-deal_info" strokeWidth={1} />,
  position: <BookUser className="icon-deal_info" strokeWidth={1} />,
  email: <Mail className="icon-deal_info" strokeWidth={1} />,
  name: <ContactRound className="icon-deal_info" strokeWidth={1} />,
};

const renderValue = (
  type: CardInfoType,
  classNameData: string | undefined,
  data: string
) => {
  const baseClasses =
    "break-normal prop-deal-value w-fit min-h-10 px-2 flex-1 bg-stone-300 dark:bg-black font-normal";

  const content = (
    <>
      {ICONS[type]}
      <span className={baseClasses}>{data}</span>
    </>
  );

  if (type === "phone") {
    return (
      <a
        href={`tel:${data.replace(/[^0-9]/g, "")}`}
        className={cn("whitespace-nowrap hover:underline", classNameData)}
      >
        {content}
      </a>
    );
  }

  if (type === "email") {
    return (
      <a
        href={`mailto:${data}`}
        className={cn("whitespace-nowrap hover:underline", classNameData)}
      >
        {content}
      </a>
    );
  }

  return <span className={classNameData}>{content}</span>;
};

type CardInfoProps = {
  data?: string | null;
  title: string;
  classNameData?: string;
  type?: CardInfoType;
};

const CardInfo: React.FC<CardInfoProps> = ({
  data,
  title,
  classNameData,
  type = "name",
}) => {
  if (!data) return null;

  return (
    <TooltipComponent content={title}>
      <p className="flex flex-col gap-2 w-full">
        {renderValue(type, classNameData, data)}
      </p>
    </TooltipComponent>
  );
};

export default CardInfo;
