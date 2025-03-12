import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {} & React.ComponentProps<"button">;

const SubmitFormActionBtn = ({ title, ...props }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full flex items-center" aria-label="Отправить форму" {...props}>
      {pending ? <Loader  className="h-5 w-5 animate-spin"/> : title}
    </Button>
  );
};

export default SubmitFormActionBtn;
