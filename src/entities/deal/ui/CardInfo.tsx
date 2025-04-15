import React from "react";

import { cn } from "@/shared/lib/utils";

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
        {data}
      </a>
    ),
    email: (
      <a
        href={`mailto:${data}`}
        className={cn("whitespace-nowrap hover:underline", classNameData)}
      >
        {data}
      </a>
    ),
    text: <span className={classNameData}>{data}</span>,
  };
};

const CardInfo = ({
  data,
  title,
  classNameData,
  type = "text",
}: {
  data: string | undefined | null;
  title: string;
  classNameData?: string | undefined;
  type?: "phone" | "email" | "text";
}) => {
  return (
    <>
      {data ? (
        <p>
          <span className="text-sm first-letter:capitalize">{title}:</span>{" "}
          {dataValue(classNameData, data)[type]}
        </p>
      ) : null}
    </>
  );
};

export default CardInfo;
