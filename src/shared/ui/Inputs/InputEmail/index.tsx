import { Input } from "@/components/ui/input";
import React from "react";

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
