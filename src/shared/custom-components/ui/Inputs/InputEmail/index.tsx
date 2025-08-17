import React from "react";

import { Input } from "@/shared/components/ui/input";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputEmail = (props: InputProps) => {
  return (
    <Input
      {...props}
      placeholder="m@example.com"
      type="email"
      className={`w-full ${props.className}`}
    />
  );
};

export default InputEmail;
