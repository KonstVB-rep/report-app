import React from "react";

const Loading = () => {
  return (
    <div className="p-5 flex flex-col gap-5 items-center justify-center">
      <div className="bg-muted h-10 rounded-md animate-pulse w-full max-w-72 md:max-w-[50%]" />
      <div className="bg-muted h-[70vh] rounded-md animate-pulse w-full" />
    </div>
  );
};

export default Loading;
