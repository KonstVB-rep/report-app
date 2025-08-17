import React from "react";

const RowInfoDealProp = ({
  label,
  value,
  direction = "row",
}: {
  label: string;
  value: string | undefined;
  direction?: "row" | "column";
}) => {
  if (!value) {
    return null;
  }
  return (
    <p
      className={`${direction === "column" ? "flex flex-col" : "items-center grid grid-cols-[33%_67%]"} gap-2`}
    >
      <span className="text-sm first-letter:capitalize p-2 prop-deal-value dark:font-light">
        {label}
      </span>
      <span className="break-words prop-deal-value p-2 dark:text-color-black font-semibold bg-stone-300 dark:bg-black">
        {value}
      </span>
    </p>
  );
};

export default RowInfoDealProp;
