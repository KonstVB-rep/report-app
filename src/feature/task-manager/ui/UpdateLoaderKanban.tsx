import React from "react";
import { BarLoader } from "react-spinners";

const UpdateLoaderKanban = () => {
  return (
    <>
      <BarLoader
        className="rounded-md !absolute top-[1px]"
        width={"100%"}
        color="#36d7b7"
      />
      <div className="absolute inset-0 z-[1000] flex cursor-pointer items-center justify-center bg-black/50" />
    </>
  );
};

export default UpdateLoaderKanban;
