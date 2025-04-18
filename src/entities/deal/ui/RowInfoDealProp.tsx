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
    <p className={`flex ${ direction === "column" ? "flex-col" : "items-center justify-start"} gap-2`}>
      <span className="text-sm first-letter:capitalize p-2 prop-deal-value dark:bg-black bg-muted font-light">
        {label} {" "}
      </span>{" "}
      <span className="prop-deal-value p-2 zinc-400 dark:text-color-black font-semibold">{value}</span>
    </p>
  );
};

export default RowInfoDealProp;
