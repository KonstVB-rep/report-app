import React from "react";

import { ContactRound, Mail, PhoneOutgoing } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import TooltipComponent from "@/shared/ui/TooltipComponent";

const ICONS = {
  phone: <PhoneOutgoing className="icon-deal_info" />,
  email: <Mail className="icon-deal_info" />,
  name: <ContactRound className="icon-deal_info" />,
} as const;

const dataValue = (
  classNameData: string | undefined,
  data: string | undefined | null
) => {
  return {
    phone: (
      <a
        href={`tel:${data}`}
        className={cn("whitespace-nowrap hover:underline", classNameData)}
      >
        {ICONS.phone}
        <span className="prop-deal-value w-fit h-10 px-2 flex-1 zinc-400 dark:text-color-black font-semibold">
          {data}
        </span>
      </a>
    ),
    email: (
      <a
        href={`mailto:${data}`}
        className={cn("whitespace-nowrap hover:underline", classNameData)}
      >
        {ICONS.email}
        <span className="prop-deal-value w-fit h-10 px-2 flex-1 zinc-400 dark:text-color-black font-semibold">
          {data}
        </span>
      </a>
    ),
    name: (
      <span className={classNameData}>
        {ICONS.name}
        <span className="prop-deal-value w-fit h-10 px-2 flex-1 zinc-400 dark:text-color-black font-semibold">
          {data}
        </span>
      </span>
    ),
  };
};

const CardInfo = ({
  data,
  title,
  classNameData,
  type = "name",
}: {
  data: string | undefined | null;
  title: string;
  classNameData?: string | undefined;
  type?: "phone" | "email" | "name";
}) => {
  return (
    <>
      {data ? (
        <TooltipComponent content={title}>
          <p className="flex flex-col gap-2 w-full">
            {dataValue(classNameData, data)[type]}
          </p>
        </TooltipComponent>
      ) : null}
    </>
  );
};

export default CardInfo;
