import React from "react";

const ErrorMessageTable = ({ message }: { message: string | undefined }) => {
  if (!message) return null;
  return (
    <div className="grid h-full place-items-center p-4">
      <h1 className="rounded-md bg-muted p-4 text-center text-xl">{message}</h1>
    </div>
  );
};

export default ErrorMessageTable;
