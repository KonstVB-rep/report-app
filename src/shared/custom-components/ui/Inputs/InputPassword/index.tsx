"use client";

import React from "react";

import { Eye, EyeClosed } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement>;
const InputPassword = (props: InputPasswordProps) => {
  const [visible, setVisible] = React.useState(false);

  const { type, ...restProps } = props;

  return (
    <div className="relative">
      <Input
        id="user_password"
        type={visible ? "text" : "password"}
        placeholder="✱✱✱✱✱✱✱"
        className={`w-full placeholder:text-sm ${props.className}`}
        {...restProps}
      />
      <Button
        variant="ghost"
        onClick={() => setVisible(!visible)}
        className="absolute bottom-[2px] right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
        size={"icon"}
        type="button"
        aria-label="Переключить видимость пароля"
      >
        {visible ? <Eye /> : <EyeClosed />}
      </Button>
    </div>
  );
};

export default InputPassword;
