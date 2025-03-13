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
        minLength={6}
        maxLength={30}
        placeholder="✱✱✱✱✱✱✱"
        required
        className="placeholder:text-xs w-full invalid:[&:not(:placeholder-shown)]:border-red-500 valid:border-green-500"
        {...props}
      />
      <Button
        variant="ghost"
        onClick={() => setVisible(!visible)}
        className="absolute h-8 w-8 top-1/2 -translate-y-1/2 bottom-[2px] right-1 rounded-full"
        size={"icon"}
        type="button"
      >
        {visible ? <EyeClosed /> : <Eye />}
      </Button>
    </div>
  );
};

export default InputPassword;
