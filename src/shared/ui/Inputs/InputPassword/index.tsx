"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import React from "react";

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement>;
const InputPassword = (props: InputPasswordProps) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        id="password"
        type={visible ? "text" : "password"}
        placeholder="✱✱✱✱✱✱✱"
        className={`w-full placeholder:text-sm ${props.className}`}
        {...props}
      />
      <Button
        variant="ghost"
        onClick={() => setVisible(!visible)}
        className="absolute bottom-[2px] right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
        size={"icon"}
        type="button"
      >
        {visible ?  <Eye /> :<EyeClosed />}
      </Button>
    </div>
  );
};

export default InputPassword;
