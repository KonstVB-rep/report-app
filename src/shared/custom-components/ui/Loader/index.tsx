import React from "react";

import { Loader } from "lucide-react";

const LoaderCircle = () => {
  return (
    <div className="flex justify-center items-center h-20 bg-muted rounded-md">
      <Loader className="animate-spin" />
    </div>
  );
};

export default LoaderCircle;
