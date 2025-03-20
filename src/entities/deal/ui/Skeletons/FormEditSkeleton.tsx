import React from "react";

const FormEditSkeleton = () => {
  return (
    <div className="grid gap-10 max-h-[85vh] overflow-y-auto">
      <div className="h-14 w-64 rounded-lg bg-muted/50 animate-pulse m-auto" />
      <div className="grid sm:grid-cols-2 gap-2 p-1">
        <div className="flex flex-col gap-4">
          {Array(6)
            .fill("")
            .map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="h-5 w-32 rounded-lg bg-muted/50 animate-pulse" />
                <div className="h-10 w-full rounded-lg bg-muted/50 animate-pulse" />
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-4">
          {Array(6)
            .fill("")
            .map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="h-5 w-32 rounded-lg bg-muted/50 animate-pulse" />
                <div className="h-10 w-full rounded-lg bg-muted/50 animate-pulse" />
              </div>
            ))}
        </div>
      </div>
      <div className="ml-auto w-32 h-12 rounded-lg bg-muted/50 animate-pulse"/>
    </div>
  );
};

export default FormEditSkeleton;
