import React from "react";

type IntoDealItemProps = {
  title: string;
  children: React.ReactNode;
};

const IntoDealItem = ({ title, children }: IntoDealItemProps) => {
  return (
    <div className="overflow-hidden rounded-md border">
      <p className="bg-muted p-4 firtst-letter:capitalize">{title}</p>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default IntoDealItem;
