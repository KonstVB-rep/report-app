import { Loader } from "lucide-react";
import React from "react";


const UpdateLoaderKanban = () => {
  return (
    <>
      <div className="absolute inset-0 z-[1000] flex cursor-pointer items-center justify-center bg-black/50" >
      <Loader className="animate animate-spin h-10 w-10" />
      </div>
    </>
  );
};

export default UpdateLoaderKanban;
